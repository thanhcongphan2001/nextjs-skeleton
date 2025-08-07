'use client';

import { useState, useEffect, useMemo, useCallback, use } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Dynamic import Leaflet only on client-side
let L: any;
if (typeof window !== 'undefined') {
	L = require('leaflet');
}

// Types
interface PlaceData {
	id: string;
	displayName?: { text: string };
	formattedAddress: string;
	location: { latitude: number; longitude: number };
	internationalPhoneNumber?: string;
}

interface MapEmbedProps {
	searchParams: Promise<{
		lat?: string;
		lng?: string;
		zoom?: string;
		viewport?: string;
		layers?: string;
		theme?: string;
		id?: string;
	}>;
}

// Constants
const DEFAULT_CENTER = { lat: 10.8231, lng: 106.6297 };
const DEFAULT_ZOOM = 10;
const PLACE_ZOOM = 16;

// Optimized ZoomControl component
const ZoomControl = () => {
	const map = useMap();

	useEffect(() => {
		if (typeof window !== 'undefined' && L) {
			const zoomControl = L.control.zoom({ position: 'bottomright' });
			map.addControl(zoomControl);

			return () => {
				map.removeControl(zoomControl);
			};
		}
	}, [map]);

	return null;
};

export default function MapEmbedPage({ searchParams }: MapEmbedProps) {
	// Unwrap searchParams using React.use()
	const params = use(searchParams);

	// State
	const [placeData, setPlaceData] = useState<PlaceData | null>(null);
	const [geocodeLoading, setGeocodeLoading] = useState(false);

	// Memoized map coordinates
	const mapConfig = useMemo(() => {
		let lat = DEFAULT_CENTER.lat;
		let lng = DEFAULT_CENTER.lng;
		let zoom = DEFAULT_ZOOM;

		// Parse viewport parameter first (highest priority)
		if (params.viewport) {
			const parts = params.viewport.split(',');
			if (parts.length === 3) {
				lat = parseFloat(parts[0]);
				lng = parseFloat(parts[1]);
				zoom = parseInt(parts[2]);
			}
		} else {
			// Fallback to individual parameters
			lat = params.lat ? parseFloat(params.lat) : lat;
			lng = params.lng ? parseFloat(params.lng) : lng;
			zoom = params.zoom ? parseInt(params.zoom) : zoom;
		}

		// Override with place data if available
		if (placeData?.location) {
			lat = placeData.location.latitude;
			lng = placeData.location.longitude;
			zoom = PLACE_ZOOM;
		}

		return { lat, lng, zoom };
	}, [params, placeData]);

	// Initialize Leaflet icons once (only on client-side)
	useEffect(() => {
		if (typeof window !== 'undefined' && L) {
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
			});
		}
	}, []);

	// Optimized API calls
	const fetchAccessToken = useCallback(async () => {
		try {
			const response = await fetch('/api-web/auth/check-token');
			if (response.ok) {
				const data = await response.json();
				console.log('Access token response:', data);
			}
		} catch (err) {
			console.error('Fetch access token error:', err);
		}
	}, []);

	const fetchPlaceData = useCallback(async (id: string) => {
		try {
			setGeocodeLoading(true);
			const response = await fetch(`/api-web/geocode/v1/place?ids=${id}`);

			if (response.ok) {
				const result = await response.json();
				console.log('Geocode response:', result);

				if (result.data) {
					setPlaceData(result.data);
				}
			} else {
				console.error('Geocode API error:', response.status, response.statusText);
			}
		} catch (err) {
			console.error('Fetch geocode error:', err);
		} finally {
			setGeocodeLoading(false);
		}
	}, []);

	// Effects
	useEffect(() => {
		fetchAccessToken();
	}, [fetchAccessToken]);

	useEffect(() => {
		if (params.id) {
			fetchPlaceData(params.id);
		}
	}, [params.id, fetchPlaceData]);

	// Memoized components
	const PlaceMarker = useMemo(() => {
		if (!placeData?.location) return null;

		return (
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
		);
	}, [placeData]);

	const DefaultMarker = useMemo(() => {
		const { lat, lng } = mapConfig;
		if (placeData || (lat === DEFAULT_CENTER.lat && lng === DEFAULT_CENTER.lng)) {
			return null;
		}

		return (
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
		);
	}, [mapConfig, placeData]);

	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<MapContainer
				key={`map-${mapConfig.lat}-${mapConfig.lng}-${mapConfig.zoom}`}
				center={[mapConfig.lat, mapConfig.lng]}
				zoom={mapConfig.zoom}
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

				{PlaceMarker}
			</MapContainer>

			{/* Loading Indicator */}
			{geocodeLoading && <div style={loadingIndicatorStyle}>🔍 Loading place...</div>}

			{/* Place Info Panel */}
			{placeData && (
				<div style={placeInfoStyle}>
					<strong>{placeData.displayName?.text || placeData.formattedAddress}</strong>
					{placeData.formattedAddress && <div style={infoLineStyle}>📍 {placeData.formattedAddress}</div>}
					{placeData.internationalPhoneNumber && (
						<div style={infoLineStyle}>📞 {placeData.internationalPhoneNumber}</div>
					)}
					{placeData.location && (
						<div style={coordinatesStyle}>
							📍 {placeData.location.latitude.toFixed(6)}, {placeData.location.longitude.toFixed(6)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// Optimized inline styles
const loadingIndicatorStyle: React.CSSProperties = {
	position: 'absolute',
	top: 8,
	right: 8,
	backgroundColor: '#2196f3',
	color: 'white',
	padding: '4px 8px',
	borderRadius: '4px',
	fontSize: '12px',
	zIndex: 1000
};

const placeInfoStyle: React.CSSProperties = {
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
};

const infoLineStyle: React.CSSProperties = {
	fontSize: '12px',
	opacity: 0.7,
	marginTop: '4px'
};

const coordinatesStyle: React.CSSProperties = {
	fontSize: '11px',
	opacity: 0.6,
	marginTop: '2px'
};
