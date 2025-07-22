# Use official Node.js image
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js app (if needed)
RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"] 