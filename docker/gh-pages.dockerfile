FROM devtrack-test

RUN npm install -g gh-pages@3.1.0

RUN git config user.email "dtom90@users.noreply.github.com"
RUN git config user.name "David Thomason"

RUN mkdir ~/.ssh && touch ~/.ssh/known_hosts
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

CMD yarn run gh_pages:build && gh-pages --dist dist_gh_pages