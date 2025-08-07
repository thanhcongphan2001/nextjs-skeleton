## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:lts as base

ARG ENV_FILE=.env

# Update system
RUN apt-get update -y

# Install basic packages
RUN npm i -g pnpm serve

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

USER node

RUN mkdir -p /home/node/app

COPY package*.json /home/node/app/
COPY yarn.* /home/node/app/
COPY pnpm-lock.* /home/node/app/
COPY .npmrc /home/node/app/

USER root

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app

# ## Development #################################################################
# # Define a development target that installs devDeps and runs in dev mode
FROM base as development
WORKDIR /home/node/app
# Switch to the node user vs. root
USER node
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN pnpm install
# Copy the source code over
COPY --chown=node:node . /home/node/app/
COPY --chown=node:node ./${ENV_FILE} /home/node/app/.env
# Expose port 3000
EXPOSE 3000
# Start the app in debug mode so we can attach the debugger
CMD ["pnpm", "run", "dev"]

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as production
WORKDIR /home/node/app
# Switch to the node user vs. root
USER node
# Copy the source code over
COPY --chown=node:node --from=development /home/node/app/ /home/node/app/
COPY --chown=node:node --from=development /home/node/app/${ENV_FILE} /home/node/app/.env
# Build the app
RUN pnpm build
# Serve your static site
CMD ["serve", "-s", "out"]

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx as deploy
# Copy what we've installed/built from production
COPY --chown=node:node --from=production /home/node/app/out/ /usr/share/nginx/html/
# # Overwrite default config
# COPY ./docker/nginx.conf /etc/nginx/nginx.conf
# COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
# # Expose port 80
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
