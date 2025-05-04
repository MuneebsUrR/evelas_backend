FROM node:18

# app directory
WORKDIR /usr/src/app


# copy package.json and install deps
COPY package*.json ./
RUN npm install

# copy rest of the app
COPY . .


#expose port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]