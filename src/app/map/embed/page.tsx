'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CSS to hide default zoom control and ensure bottom-right positioning
const mapStyles = `
  .leaflet-top.leaflet-left .leaflet-control-zoom {
    display: none !important;
  }
  .leaflet-bottom.leaflet-right .leaflet-control-zoom {
    display: block !important;
  }
`;

// Component to add zoom control at bottom-right
function ZoomControl() {
	const map = useMap();

	useEffect(() => {
		// Add timeout to ensure map is fully loaded
		const timer = setTimeout(() => {
			// Add new zoom control at bottom-right
			const zoomControl = L.control.zoom({
				position: 'bottomright'
			});

			map.addControl(zoomControl);
		}, 100);

		return () => {
			clearTimeout(timer);
		};
	}, [map]);

	return null;
}

interface MapEmbedProps {
	searchParams: {
		lat?: string;
		lng?: string;
		zoom?: string;
		viewport?: string;
		layers?: string;
		theme?: string;
		id?: string;
	};
}

export default function MapEmbedPage({ searchParams }: MapEmbedProps) {
	let lat = 10.8231;
	let lng = 106.6297;
	let zoom = 10;

	const [isLoading, setIsLoading] = useState(false);
	const [placeData, setPlaceData] = useState<any>(null);
	const [geocodeLoading, setGeocodeLoading] = useState(false);

	// Fix Leaflet default marker icons
	useEffect(() => {
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
		});
	}, []);

	// Call access-token API
	useEffect(() => {
		const fetchAccessToken = async () => {
			try {
				setIsLoading(true);

				const response = await fetch('/api-web/auth/check-token', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					const data = await response.json();
					console.log('Access token response:', data);
				} else {
					const errorData = await response.json().catch(() => ({}));

					console.error('Access token error:', errorData);
				}
			} catch (err) {
				console.error('Fetch access token error:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAccessToken();
	}, []);

	useEffect(() => {
		const fetchPlaceData = async () => {
			if (!searchParams.id) return;

			try {
				setGeocodeLoading(true);

				const response = await fetch(`/api-web/geocode/v1/place?ids=${searchParams.id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					const result = await response.json();
					console.log('Geocode response:', result);

					// Handle OTS Maps API response format
					if (result.data) {
						setPlaceData(result.data);

						// Update map center if place data has coordinates
						if (result.data.location) {
							lat = result.data.location.latitude;
							lng = result.data.location.longitude;
							// Set appropriate zoom for place view
							zoom = 16;
						}
					}
				} else {
					console.error('Geocode API error:', response.status, response.statusText);
				}
			} catch (err) {
				console.error('Fetch geocode error:', err);
			} finally {
				setGeocodeLoading(false);
			}
		};

		fetchPlaceData();
	}, [searchParams.id]);

	if (searchParams.viewport) {
		const viewportParts = searchParams.viewport.split(',');
		if (viewportParts.length === 3) {
			lat = parseFloat(viewportParts[0]);
			lng = parseFloat(viewportParts[1]);
			zoom = parseInt(viewportParts[2]);
		}
	} else {
		// Fallback to individual parameters if viewport not provided
		lat = searchParams.lat ? parseFloat(searchParams.lat) : lat;
		lng = searchParams.lng ? parseFloat(searchParams.lng) : lng;
		zoom = searchParams.zoom ? parseInt(searchParams.zoom) : zoom;
	}

	return (
		<div
			style={{
				height: '100vh',
				width: '100%'
			}}
		>
			<MapContainer
				key="map-container"
				center={[lat, lng]}
				zoom={zoom}
				scrollWheelZoom={true}
				style={{ height: '100%', width: '100%' }}
				zoomControl={false}
				attributionControl={true}
			>
				<TileLayer
					attribution="© OTS Maps"
					url="/api-web/tiles/v1/basic/{z}/{x}/{y}.png"
					maxZoom={18}
					minZoom={1}
				/>

				{/* Add zoom control at bottom-right */}
				<ZoomControl />

				{/* Marker for place location */}
				{placeData && placeData.location && (
					<Marker position={[placeData.location.latitude, placeData.location.longitude]}>
						<Popup>
							<div style={{ minWidth: '200px' }}>
								<strong>{placeData.displayName?.text || 'Place'}</strong>
								<br />
								<small>{placeData.formattedAddress}</small>
								{placeData.internationalPhoneNumber && (
									<>
										<br />
										<small>📞 {placeData.internationalPhoneNumber}</small>
									</>
								)}
							</div>
						</Popup>
					</Marker>
				)}

				{/* Default marker when no place data but has coordinates */}
				{!placeData && (lat !== 10.8231 || lng !== 106.6297) && (
					<Marker position={[lat, lng]}>
						<Popup>
							<div>
								<strong>Location</strong>
								<br />
								<small>
									📍 {lat.toFixed(6)}, {lng.toFixed(6)}
								</small>
							</div>
						</Popup>
					</Marker>
				)}
			</MapContainer>

			{/* Geocode Loading Indicator */}
			{geocodeLoading && (
				<div
					style={{
						position: 'absolute',
						top: 8,
						right: 8,
						backgroundColor: '#2196f3',
						color: 'white',
						padding: '4px 8px',
						borderRadius: '4px',
						fontSize: '12px',
						zIndex: 1000
					}}
				>
					🔍 Loading place...
				</div>
			)}

			{/* Place Info */}
			{placeData && (
				<div
					style={{
						position: 'absolute',
						top: 8,
						left: 8,
						backgroundColor: 'rgba(255, 255, 255, 0.95)',
						color: 'black',
						padding: '8px 12px',
						borderRadius: '4px',
						fontSize: '14px',
						maxWidth: '350px',
						zIndex: 1000,
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
						border: '1px solid rgba(0, 0, 0, 0.1)'
					}}
				>
					<strong>{placeData.displayName?.text || placeData.formattedAddress}</strong>
					{placeData.formattedAddress && (
						<div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
							📍 {placeData.formattedAddress}
						</div>
					)}
					{placeData.internationalPhoneNumber && (
						<div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>
							📞 {placeData.internationalPhoneNumber}
						</div>
					)}
					{placeData.location && (
						<div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>
							📍 {placeData.location.latitude.toFixed(6)}, {placeData.location.longitude.toFixed(6)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
