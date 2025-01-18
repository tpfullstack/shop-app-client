# Use a lighter version of Node as a parent image
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# copy package.json into the container at /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# install dependencies
RUN npm install --legacy-peer-deps

# Copy the current directory contents into the container at /app
COPY . /app

# Expose port
EXPOSE 4200

# Run the app when the container launches
CMD ["npm", "start"]