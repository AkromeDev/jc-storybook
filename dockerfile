FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

# Expose the port used by Angular (default is 4200)
EXPOSE 6006

# Command to start the Angular development server
# CMD ["npm", "run", "start"]
CMD ["npm", "run", "storybook"]
