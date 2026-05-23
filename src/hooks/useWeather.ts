import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export interface WeatherData {
  temp: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const WMO_MAP: Record<number, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  0:  { icon: 'sunny',        label: '晴'       },
  1:  { icon: 'sunny',        label: '大致晴'    },
  2:  { icon: 'partly-sunny', label: '多云'      },
  3:  { icon: 'cloudy',       label: '阴天'      },
  45: { icon: 'cloudy',       label: '有雾'      },
  48: { icon: 'cloudy',       label: '雾凇'      },
  51: { icon: 'rainy',        label: '细雨'      },
  53: { icon: 'rainy',        label: '小雨'      },
  55: { icon: 'rainy',        label: '中雨'      },
  61: { icon: 'rainy',        label: '小雨'      },
  63: { icon: 'rainy',        label: '中雨'      },
  65: { icon: 'rainy',        label: '大雨'      },
  71: { icon: 'snow',         label: '小雪'      },
  73: { icon: 'snow',         label: '中雪'      },
  75: { icon: 'snow',         label: '大雪'      },
  77: { icon: 'snow',         label: '雪粒'      },
  80: { icon: 'rainy',        label: '阵雨'      },
  81: { icon: 'rainy',        label: '中阵雨'    },
  82: { icon: 'thunderstorm', label: '暴雨'      },
  85: { icon: 'snow',         label: '阵雪'      },
  86: { icon: 'snow',         label: '大阵雪'    },
  95: { icon: 'thunderstorm', label: '雷暴'      },
  96: { icon: 'thunderstorm', label: '雷暴冰雹'  },
  99: { icon: 'thunderstorm', label: '雷暴大冰雹'},
};

function getWmo(code: number) {
  return (
    WMO_MAP[code] ??
    WMO_MAP[Math.floor(code / 10) * 10] ??
    { icon: 'cloudy' as const, label: '未知' }
  );
}

export function useWeather(lat: number, lng: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
    setLoading(true);
    setStale(false);

    (async () => {
      try {
        const res  = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`,
        );
        const json = await res.json();
        if (cancelled) return;
        const code: number = json?.current?.weather_code ?? 3;
        const temp: number = json?.current?.temperature_2m ?? 0;
        const wmo  = getWmo(code);
        const data: WeatherData = { temp: Math.round(temp), icon: wmo.icon, label: wmo.label };
        setWeather(data);
        setStale(false);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      } catch {
        if (cancelled) return;
        try {
          const cached = await AsyncStorage.getItem(cacheKey);
          if (cached) {
            setWeather(JSON.parse(cached));
            setStale(true);
          } else {
            setWeather(null);
          }
        } catch {
          if (!cancelled) setWeather(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [lat, lng]);

  return { weather, loading, stale };
}
