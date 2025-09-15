import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 60,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '8px solid #cbd5e1',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
          }}
        >
          {/* Chat bubbles */}
          <div style={{ position: 'relative', display: 'flex' }}>
            {/* Back bubble */}
            <div
              style={{
                width: 80,
                height: 60,
                background: 'rgba(0, 212, 212, 0.3)',
                borderRadius: 20,
                position: 'absolute',
                left: -10,
                top: -10,
              }}
            />
            {/* Front bubble */}
            <div
              style={{
                width: 100,
                height: 80,
                background: '#00D4D4',
                borderRadius: 25,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 60, height: 4, background: 'white', borderRadius: 2 }} />
              <div style={{ width: 40, height: 4, background: 'white', borderRadius: 2 }} />
              <div style={{ width: 30, height: 4, background: 'white', borderRadius: 2 }} />
            </div>
          </div>
          {/* Star decoration */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 30,
              width: 20,
              height: 20,
              background: '#00D4D4',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
          {/* Security shield */}
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              right: 20,
              width: 30,
              height: 35,
              background: '#F59E0B',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </div>
      </div>
    ),
    { width: size.width, height: size.height }
  );
}

