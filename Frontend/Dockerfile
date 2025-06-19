# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy your frontend files to the Nginx web root
# The 'Frontend' context in your Jenkinsfile's docker build command
# makes 'Frontend' the build context.
# So, 'COPY .' copies everything from the 'Frontend' directory into the image.
COPY . /usr/share/nginx/html

# Expose port 80, the default HTTP port for Nginx
EXPOSE 80

# Nginx serves static files by default, no additional CMD needed