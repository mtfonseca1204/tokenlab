'use client';

import { GeneratedTokens } from '@/lib/types';

interface PreviewProps {
  tokens: GeneratedTokens;
  fontFamily: string;
}

export function Preview({ tokens, fontFamily }: PreviewProps) {
  const { colors, radius, shadows } = tokens;
  const r = radius.find((r) => r.name === 'lg')?.value || '12px';
  const rMd = radius.find((r) => r.name === 'md')?.value || '8px';
  const rSm = radius.find((r) => r.name === 'sm')?.value || '4px';
  const shadow = shadows[2]?.value || 'none';

  const font = `'${fontFamily}', system-ui, sans-serif`;

  return (
    <div
      className="rounded-2xl p-8 transition-colors duration-300"
      style={{ backgroundColor: colors.neutral['100'], fontFamily: font }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Component */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: r,
            boxShadow: shadow,
            padding: '24px',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 flex items-center justify-center text-white font-bold text-sm"
              style={{
                backgroundColor: colors.primary['500'],
                borderRadius: rMd,
                transition: 'background-color 200ms ease',
              }}
            >
              TL
            </div>
            <div>
              <h4
                style={{
                  color: colors.neutral['900'],
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  lineHeight: 1.3,
                }}
              >
                TokenLab
              </h4>
              <p
                style={{
                  color: colors.neutral['500'],
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                }}
              >
                Design Token Generator
              </p>
            </div>
          </div>

          <p
            style={{
              color: colors.neutral['600'],
              fontSize: '0.8125rem',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}
          >
            Generate a complete design token system from your brand in seconds.
            Perfect for designers and developers building consistent products.
          </p>

          <div className="flex gap-2.5">
            <button
              style={{
                backgroundColor: colors.primary['500'],
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: rMd,
                fontSize: '0.8125rem',
                fontWeight: 600,
                fontFamily: font,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 200ms ease',
              }}
            >
              Get Started
            </button>
            <button
              style={{
                backgroundColor: 'transparent',
                color: colors.primary['600'],
                padding: '9px 18px',
                borderRadius: rMd,
                fontSize: '0.8125rem',
                fontWeight: 600,
                fontFamily: font,
                border: `1.5px solid ${colors.primary['200']}`,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Form Component */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: r,
            boxShadow: shadow,
            padding: '24px',
          }}
        >
          <h4
            style={{
              color: colors.neutral['900'],
              fontWeight: 600,
              fontSize: '0.9375rem',
              marginBottom: '18px',
            }}
          >
            Create Account
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label
                style={{
                  color: colors.neutral['600'],
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jane Cooper"
                readOnly
                style={{
                  width: '100%',
                  padding: '9px 13px',
                  borderRadius: rMd,
                  border: `1.5px solid ${colors.neutral['200']}`,
                  fontSize: '0.8125rem',
                  color: colors.neutral['900'],
                  backgroundColor: colors.neutral['50'],
                  outline: 'none',
                  fontFamily: font,
                  transition: 'border-color 200ms ease',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  color: colors.neutral['600'],
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Email
              </label>
              <input
                type="text"
                placeholder="jane@example.com"
                readOnly
                style={{
                  width: '100%',
                  padding: '9px 13px',
                  borderRadius: rMd,
                  border: `1.5px solid ${colors.neutral['200']}`,
                  fontSize: '0.8125rem',
                  color: colors.neutral['900'],
                  backgroundColor: colors.neutral['50'],
                  outline: 'none',
                  fontFamily: font,
                  transition: 'border-color 200ms ease',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            style={{
              width: '100%',
              backgroundColor: colors.primary['500'],
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: rMd,
              fontSize: '0.8125rem',
              fontWeight: 600,
              fontFamily: font,
              border: 'none',
              cursor: 'pointer',
              marginBottom: '14px',
              transition: 'background-color 200ms ease',
            }}
          >
            Create Account
          </button>

          <div className="flex gap-2 justify-center">
            <span
              style={{
                backgroundColor: colors.success['100'],
                color: colors.success['700'],
                borderRadius: rSm,
                padding: '3px 10px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                transition: 'all 200ms ease',
              }}
            >
              Active
            </span>
            <span
              style={{
                backgroundColor: colors.warning['100'],
                color: colors.warning['700'],
                borderRadius: rSm,
                padding: '3px 10px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                transition: 'all 200ms ease',
              }}
            >
              Pending
            </span>
            <span
              style={{
                backgroundColor: colors.error['100'],
                color: colors.error['700'],
                borderRadius: rSm,
                padding: '3px 10px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                transition: 'all 200ms ease',
              }}
            >
              Inactive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
