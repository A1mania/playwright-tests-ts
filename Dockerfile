FROM mcr.microsoft.com/playwright:v1.57.0-noble
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npx", "playwright", "test"]
