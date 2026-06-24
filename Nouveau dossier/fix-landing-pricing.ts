import fs from 'fs';

const path = 'src/pages/Landing.tsx';
let content = fs.readFileSync(path, 'utf-8');

const regex = /\{\s*id:\s*'starter' as const,\s*name:\s*'STARTER'[\s\S]*?'Subscribe to Business',\s*\}/m;

const replacement = `{
                id: 'starter' as const,
                name: translate('landing.pricing.starter.name'),
                desc: translate('landing.pricing.starter.desc'),
                priceMonth: 59,
                priceQuarter: 51,
                priceYear: 39,
                isPopular: false,
                delay: 0.05,
                features: [
                  { text: translate('landing.pricing.starter.feat1'), highlight: false },
                  { text: translate('landing.pricing.starter.feat2'), highlight: true },
                  { text: translate('landing.pricing.starter.feat3'), highlight: false },
                  { text: translate('landing.pricing.starter.feat4'), highlight: false },
                  { text: translate('landing.pricing.starter.feat5'), highlight: false },
                  { text: translate('landing.pricing.starter.feat6'), highlight: false },
                  { text: translate('landing.pricing.starter.feat7'), highlight: false },
                  { text: translate('landing.pricing.starter.feat8'), highlight: false },
                ],
                buttonText: translate('landing.pricing.starter.btn'),
              },
              {
                id: 'pro' as const,
                name: translate('landing.pricing.pro.name'),
                desc: translate('landing.pricing.pro.desc'),
                priceMonth: 89,
                priceQuarter: 76,
                priceYear: 57,
                isPopular: true,
                delay: 0.1,
                features: [
                  { text: translate('landing.pricing.pro.feat1'), highlight: true },
                  { text: translate('landing.pricing.pro.feat2'), highlight: false },
                  { text: translate('landing.pricing.pro.feat3'), highlight: true },
                  { text: translate('landing.pricing.pro.feat4'), highlight: true },
                  { text: translate('landing.pricing.pro.feat5'), highlight: false },
                  { text: translate('landing.pricing.pro.feat6'), highlight: false },
                  { text: translate('landing.pricing.pro.feat7'), highlight: false },
                  { text: translate('landing.pricing.pro.feat8'), highlight: false },
                ],
                buttonText: translate('landing.pricing.pro.btn'),
              },
              {
                id: 'business' as const,
                name: translate('landing.pricing.business.name'),
                desc: translate('landing.pricing.business.desc'),
                priceMonth: 149,
                priceQuarter: 126,
                priceYear: 110,
                isPopular: false,
                delay: 0.15,
                features: [
                  { text: translate('landing.pricing.business.feat1'), highlight: true },
                  { text: translate('landing.pricing.business.feat2'), highlight: false },
                  { text: translate('landing.pricing.business.feat3'), highlight: true },
                  { text: translate('landing.pricing.business.feat4'), highlight: false },
                  { text: translate('landing.pricing.business.feat5'), highlight: false },
                  { text: translate('landing.pricing.business.feat6'), highlight: false },
                  { text: translate('landing.pricing.business.feat7'), highlight: false },
                  { text: translate('landing.pricing.business.feat8'), highlight: false },
                ],
                buttonText: translate('landing.pricing.business.btn'),
              }`;

content = content.replace(regex, replacement);

fs.writeFileSync(path, content, 'utf-8');
console.log('updated Landing pricing arrays');
