'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ZoomControl component
const ZoomControl = () => {
	const map = useMap();
	
	const zoomIn = useCallback(() => {
		map.zoomIn();
	}, [map]);

	const zoomOut = useCallback(() => {
		map.zoomOut();
	}, [map]);

	return (
		<div className="absolute top-4 right-4 z-[1000] flex flex-col bg-white rounded shadow-lg">
			<button
				onClick={zoomIn}
				className="px-3 py-2 text-gray-700 hover:bg-gray-100 border-b border-gray-200 rounded-t"
				aria-label="Zoom in"
			>
				+
			</button>
			<button
				onClick={zoomOut}
				className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-b"
				aria-label="Zoom out"
			>
				−
			</button>
		</div>
	);
};

interface MapComponentProps {
	center: [number, number];
	zoom: number;
	markers?: Array<{
		position: [number, number];
		popup?: string;
	}>;
	tileServer?: string;
}

const MapComponent = ({ center, zoom, markers = [], tileServer }: MapComponentProps) => {
	const [mapReady, setMapReady] = useState(false);

	useEffect(() => {
		setMapReady(true);
	}, []);

	const tileUrl = useMemo(() => {
		return tileServer || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	}, [tileServer]);

	if (!mapReady) {
		return (
			<div className="w-full h-full flex items-center justify-center bg-gray-100">
				<div className="text-gray-600">Loading map...</div>
			</div>
		);
	}

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			style={{ height: '100%', width: '100%' }}
			zoomControl={false}
		>
			<TileLayer
				url={tileUrl}
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{markers.map((marker, index) => (
				<Marker key={index} position={marker.position}>
					{marker.popup && <Popup>{marker.popup}</Popup>}
				</Marker>
			))}
			<ZoomControl />
		</MapContainer>
	);
};

export default MapComponent;
