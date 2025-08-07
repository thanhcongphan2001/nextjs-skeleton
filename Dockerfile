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
FROM node:lts-alpine as deploy

WORKDIR /app
USER node

# Copy only necessary output from production stage
COPY --from=production /home/node/app/.next .next
COPY --from=production /home/node/app/public public
COPY --from=production /home/node/app/package.json .
COPY --from=production /home/node/app/node_modules node_modules

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
