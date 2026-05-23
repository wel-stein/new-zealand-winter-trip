import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { getItineraryForDay, ITINERARY_BY_DAY } from '../data/itinerary';

interface MapViewProps {
  selectedDay: number;
  onDaySelect?: (day: number) => void;
}

export function MapView({ selectedDay, onDaySelect }: MapViewProps) {
  const dayData = getItineraryForDay(selectedDay);
  const currentIndex = ITINERARY_BY_DAY.findIndex((d) => d.day === selectedDay);

  const webViewRef = useRef<any>(null);

  // Handle marker tap messages from iframe (web platform)
  useEffect(() => {
    if (Platform.OS !== 'web' || !onDaySelect) return;
    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === 'daySelect' && typeof data.day === 'number') {
          onDaySelect(data.day);
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onDaySelect]);

  const mapHtml = useMemo(() => {
    const allPoints = ITINERARY_BY_DAY.map((d) => ({
      lat: d.lat,
      lng: d.lng,
      label: d.location,
      day: d.day,
      title: d.dayTitle,
      active: d.day === selectedDay,
    }));

    const routeCoords = ITINERARY_BY_DAY.map((d) => `[${d.lat}, ${d.lng}]`).join(',');

    return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; }
  .active-popup .leaflet-popup-content-wrapper {
    background: #1a2a1f; color: #e0e8e3; border: 1px solid #95d4b3;
    border-radius: 10px; font-family: system-ui;
  }
  .active-popup .leaflet-popup-tip { background: #1a2a1f; }
  .active-popup .leaflet-popup-content { margin: 8px 12px; }
  .popup-title { font-size: 13px; font-weight: 600; color: #95d4b3; }
  .popup-loc { font-size: 11px; color: #b0c4b8; margin-top: 2px; }
  .tap-hint { font-size: 10px; color: #7a9a8a; margin-top: 4px; }
</style>
</head><body>
<div id="map"></div>
<script>
  function sendMsg(day) {
    var msg = JSON.stringify({ type: 'daySelect', day: day });
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(msg);
    } else {
      window.parent.postMessage(msg, '*');
    }
  }

  var map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([${dayData.lat}, ${dayData.lng}], ${selectedDay === 25 ? 5 : 9});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18
  }).addTo(map);

  // Route polyline
  var route = [${routeCoords}];
  L.polyline(route.slice(1), { color: '#95d4b366', weight: 2, dashArray: '6,8' }).addTo(map);

  // Markers
  var points = ${JSON.stringify(allPoints)};
  points.forEach(function(p, i) {
    if (i === 0 && !p.active) return; // skip Singapore unless selected
    var icon = L.divIcon({
      className: '',
      html: p.active
        ? '<div style="width:28px;height:28px;border-radius:50%;background:#1a5a3a;border:3px solid #95d4b3;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px #95d4b366;cursor:pointer"><div style="width:8px;height:8px;border-radius:50%;background:#95d4b3"></div></div>'
        : '<div style="width:14px;height:14px;border-radius:50%;background:#95d4b533;border:1.5px solid #95d4b377;cursor:pointer"></div>',
      iconSize: p.active ? [28, 28] : [14, 14],
      iconAnchor: p.active ? [14, 14] : [7, 7]
    });
    var marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
    marker.on('click', function() { sendMsg(p.day); });
    if (p.active) {
      marker.bindPopup(
        '<div class="popup-title">' + p.title + '</div><div class="popup-loc">' + p.label + '</div><div class="tap-hint">点击其他城市切换日期</div>',
        { className: 'active-popup', closeButton: false, autoClose: false, closeOnClick: false }
      ).openPopup();
    }
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);
</script>
</body></html>`;
  }, [selectedDay, dayData.lat, dayData.lng]);

  return (
    <View style={styles.container}>
      {/* Interactive map */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={mapHtml}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 } as any}
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: mapHtml }}
            style={styles.webview}
            scrollEnabled={false}
            javaScriptEnabled
            onMessage={(event: WebViewMessageEvent) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data?.type === 'daySelect' && onDaySelect) {
                  onDaySelect(data.day);
                }
              } catch {}
            }}
          />
        )}
      </View>

      {/* Trip progress bar */}
      <View style={styles.progressRow}>
        {ITINERARY_BY_DAY.map((d, index) => {
          const isActive = d.day === selectedDay;
          const isPast = index < currentIndex;
          return (
            <React.Fragment key={d.day}>
              <View style={[
                styles.progressDot,
                isPast && styles.progressDotPast,
                isActive && styles.progressDotActive,
              ]}>
                {isActive && <View style={styles.progressDotInner} />}
              </View>
              {index < ITINERARY_BY_DAY.length - 1 && (
                <View style={[styles.progressLine, isPast && styles.progressLinePast]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.progressLabels}>
        <Text style={styles.progressLabelText}>5月25日</Text>
        <Text style={styles.progressLabelText}>6月4日</Text>
      </View>

      {/* Today's stops */}
      <View style={styles.stopsCard}>
        <Text style={styles.sectionTitle}>今日行程路线</Text>
        {dayData.items.map((item, index) => {
          const isLast = index === dayData.items.length - 1;
          return (
            <View key={item.id} style={styles.stopRow}>
              <View style={styles.stopLeft}>
                <View style={[styles.stopDot, { backgroundColor: item.tagColor }]} />
                {!isLast && <View style={styles.stopLine} />}
              </View>
              <View style={[styles.stopContent, !isLast && { paddingBottom: Spacing.md }]}>
                <Text style={styles.stopTime}>{item.time}</Text>
                <View style={styles.stopTextRow}>
                  <Text style={styles.stopTitle}>{item.title}</Text>
                  <View style={[styles.stopTag, { backgroundColor: item.tagColor + '33' }]}>
                    <Text style={[styles.stopTagText, { color: item.tagColor }]}>{item.tag}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },

  // Map
  mapContainer: {
    height: 300,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Progress bar
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotPast: {
    backgroundColor: Colors.primary + '66',
  },
  progressDotActive: {
    width: 14,
    height: 14,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  progressDotInner: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.outlineVariant,
  },
  progressLinePast: {
    backgroundColor: Colors.primary + '66',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 2,
  },
  progressLabelText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },

  // Stops timeline
  stopsCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stopRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    minHeight: 48,
  },
  stopLeft: {
    width: 16,
    alignItems: 'center',
    paddingTop: 4,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  stopLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.outlineVariant,
    marginTop: 4,
  },
  stopContent: {
    flex: 1,
  },
  stopTime: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 2,
  },
  stopTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  stopTitle: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontSize: 14,
    flex: 1,
  },
  stopTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  stopTagText: {
    ...Typography.labelSm,
    fontSize: 10,
  },
});
