FROM node:22-alpine
WORKDIR /app
COPY web/package.json ./package.json
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.mjs"]
