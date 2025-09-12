import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  const svg = await fetch(new URL('../public/icon.svg', import.meta.url)).then((r) => r.text());

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
          style={{ width: 256, height: 256 }}
          // eslint-disable-next-line @next/next/no-img-element
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    ),
    { width: size.width, height: size.height }
  );
}

