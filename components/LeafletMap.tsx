import React, { useEffect, useState, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { LeafletView, MapMarker, MapShape, MapShapeType, WebviewLeafletMessage, WebViewLeafletEvents } from 'react-native-leaflet-view';
import { Asset } from 'expo-asset';

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  icon?: 'harvester' | 'farmer' | 'owner';
  heading?: number;
}

interface LeafletMapProps {
  markers?: MarkerData[];
  polyLine?: { latitude: number; longitude: number }[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  onMarkerPress?: (id: string) => void;
  onMapReady?: () => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers = [],
  polyLine = [],
  initialRegion,
  onMarkerPress,
  onMapReady
}) => {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(initialRegion?.latitudeDelta ? Math.floor(10 / (initialRegion.latitudeDelta || 0.1)) : 13);
  
  useEffect(() => {
    let isMounted = true;
    const loadHtml = async () => {
      try {
        const path = require('../assets/leaflet.html');
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        
        if (asset.localUri && isMounted) {
          try {
            // Modern SDK 54+ API
            const FileSystem = require('expo-file-system');
            if (FileSystem.File) {
              const file = new FileSystem.File(asset.localUri);
              const content = await file.text();
              setWebViewContent(content);
            } else {
              // Legacy API fallback
              const content = await FileSystem.readAsStringAsync(asset.localUri);
              setWebViewContent(content);
            }
          } catch (e) {
            console.warn('Modern File API failed, trying legacy:', e);
            const FileSystem = require('expo-file-system');
            const content = await FileSystem.readAsStringAsync(asset.localUri);
            setWebViewContent(content);
          }
        }
      } catch (error) {
        console.error('Error loading Leaflet HTML:', error);
      }
    };
    loadHtml();
    return () => { isMounted = false; };
  }, []);

  const mapMarkers = useMemo(() => {
    return markers.map(m => {
      let iconHtml = '';
      const rotate = m.heading || 0;

      if (m.icon === 'harvester') {
        iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #0d631b; width: 36px; height: 36px; border-radius: 18px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12V9h3l2.25 3H17z"/></svg>
            </div>
            ${m.title ? `<div style="background: #0d631b; padding: 2px 8px; border-radius: 8px; margin-top: 4px; font-size: 11px; font-weight: 900; color: white; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3);">${m.title}</div>` : ''}
          </div>
        `;
      } else if (m.icon === 'farmer') {
        iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #ef4444; width: 36px; height: 36px; border-radius: 18px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            ${m.title ? `<div style="background: #ef4444; padding: 2px 8px; border-radius: 8px; margin-top: 4px; font-size: 11px; font-weight: 900; color: white; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3);">${m.title}</div>` : ''}
          </div>
        `;
      } else if (m.icon === 'owner') {
        iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #0d631b; width: 44px; height: 44px; border-radius: 22px; border: 3px solid white; display: flex; align-items: center; justify-content: center; transform: rotate(${rotate}deg); box-shadow: 0 8px 16px rgba(0,0,0,0.4);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <div style="background: #0d631b; padding: 4px 10px; border-radius: 10px; margin-top: 6px; font-size: 12px; font-weight: 900; color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white;">YOU</div>
          </div>
        `;
      } else {
        iconHtml = `<div style="background: #2563eb; width: 24px; height: 24px; border-radius: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
      }

      return {
        id: m.id,
        position: { lat: m.latitude, lng: m.longitude },
        icon: iconHtml,
        size: [80, 100],
        iconAnchor: [40, 44] as any, // Positioned around center
      } as MapMarker;
    });
  }, [markers]);

  const mapShapes = useMemo(() => {
    if (!polyLine || polyLine.length < 2) return [];
    return [{
      id: 'route',
      shapeType: MapShapeType.POLYLINE,
      positions: polyLine.map(p => ({ lat: p.latitude, lng: p.longitude })),
      color: '#0d631b',
    }] as MapShape[];
  }, [polyLine]);

  const mapCenter = useMemo(() => {
    if (initialRegion) {
      return { lat: initialRegion.latitude, lng: initialRegion.longitude };
    }
    if (markers.length > 0) {
      return { lat: markers[0].latitude, lng: markers[0].longitude };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [initialRegion?.latitude, initialRegion?.longitude, markers[0]?.latitude, markers[0]?.longitude]);

  const handleMessageReceived = (message: WebviewLeafletMessage) => {
    if (message.msg === WebViewLeafletEvents.MAP_READY) {
      onMapReady?.();
    }
    if (message.event === WebViewLeafletEvents.ON_ZOOM_END) {
      if (message.payload?.zoom) {
        setCurrentZoom(message.payload.zoom);
      }
    }
    if (message.event === WebViewLeafletEvents.ON_MAP_MARKER_CLICKED) {
      if (message.payload?.mapMarkerID) {
        onMarkerPress?.(message.payload.mapMarkerID);
      }
    }
  };

  if (!webViewContent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d631b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeafletView
        source={{ html: webViewContent }}
        mapMarkers={mapMarkers}
        mapShapes={mapShapes}
        mapCenterPosition={mapCenter}
        zoom={currentZoom}
        onMessageReceived={handleMessageReceived}
        zoomControl={false}
        attributionControl={false}
        doDebug={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafaf5',
  },
});
