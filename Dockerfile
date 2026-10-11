FROM node:22-alpine
WORKDIR /app
COPY web/package.json ./package.json
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run build
RUN cp app.js experience.js swarm.js civilization.js art-studio.js onchain-exhibit.js dist/ && cp deployment.json testnet-deployment.json dist/ && cp styles.css civilization.css art-studio.css dist/
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.mjs"]
