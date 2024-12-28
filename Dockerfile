FROM node:18
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --only=production
COPY . .
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1
CMD [ "node", "index.js" ]