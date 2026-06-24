FROM node:22-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0
WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder

ARG BACKEND_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_SSE_URL=http://localhost:3000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:5000

ENV BACKEND_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SSE_URL=${NEXT_PUBLIC_SSE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY app ./app
COPY components ./components
COPY features ./features
COPY i18n ./i18n
COPY lib ./lib
COPY messages ./messages
COPY public ./public
COPY services ./services
COPY styles ./styles
COPY types ./types
COPY env.ts ./env.ts
COPY eslint.config.mjs ./eslint.config.mjs
COPY global.d.ts ./global.d.ts
COPY next-env.d.ts ./next-env.d.ts
COPY next.config.ts ./next.config.ts
COPY postcss.config.mjs ./postcss.config.mjs
COPY proxy.ts ./proxy.ts
COPY tailwind.config.ts ./tailwind.config.ts
COPY tsconfig.json ./tsconfig.json

RUN npm run build
RUN npm prune --omit=dev

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=5000
ENV HOSTNAME=0.0.0.0

ARG BACKEND_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_SSE_URL=http://localhost:3000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:5000

ENV BACKEND_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SSE_URL=${NEXT_PUBLIC_SSE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

USER nextjs

EXPOSE 5000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]