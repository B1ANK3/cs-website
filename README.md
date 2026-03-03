# CS website

## Notes update

Svelte has some problems with routing. I suspect this is due to compilers for javascript still being
discovered and made useful. It also probably has to do with the design of this repo and how data is structured.
Data is mostly generated from markdown and '.svx' files (Markdown with Svelte preprocessor).
We don't expect the user to manually add all different paths to markdown files. Therefore most of the
processing is done after the files have been rendered. Typescript and Svelte complain about the
types of this because they can't validate the string is correct. Neither can we but its up to the
webmaster to make sure links are not broken.

## Future Plans

Depending on the amount of time available, either complete the TODOs, make some better graphics or follow
the branding theme a little closer.
In the long term, figure out a way to manage content better. Currently pushing content straight into $lib works but needs to be very precise about what goes in.
The types are arbitrary to the current use case. Theres no room for error else rendering might break.

### For CS division

Need some new photos and content for the site. Most of it is placeholders. There is some cool stuff that can be added but
linking to external sites is also allowed and does happen. It would be nice to have everything under one layout though.

## Use of AI

This project heavily relied on the use of AI to produce this website in the time frame of 5 days.
There is bound to be problems with files and tech debt from using AI, but this is a POC.
FYI: Went through all copilot tokens for the month the day I got copilot.

## TODOs

- [x] Github Pipeline
    - [x] Git pages up
- [ ] Theming - secondary colors and highlights
- [ ] Fix dialog boxes
- [ ] Add cs character (a drone or something IDK)
- [ ] Theming - Add images instead of gradients in hero sections
- [ ] Theming - Make contact area consistent
- [ ] Theming - Background consistency
- [x] Send in application

### High

- [x] Contact information
    - Simple enough, fun way to present it?
    - [ ] Phone, email, location, qr codes? (Update style, information)
- [x] Events
    - [ ] Calendar
    - [ ] Number fix
    - [ ] RSS feed? (Later)
- [x] Figure out where I can put academics. Undergrad, postgrad, masters and phds
    - [ ] Not another grid card list (boring at this point). Find something else (trees/graphs?)
- [x] Student resources
    - [x] From rulebook: FAQ, forms, useful links
    - How to structure this data
- [x] Details about departments. Facility profiles
    - [x] Redirects to courses pages
    - [ ] These pages are either hosted and need a redirect or use a different layout
- [ ] Research output, publications (linked to profiles)
    - [ ] Arxiv like interface or a markdown interface?
    - [x] Groups
- [x] Course catalogs
    - [ ] Courses with own websites (redirects) or not.
    - [x] Information
    - [ ] Find a cool way to present
- [ ] (biggest problem): Isographic
    - [ ] Sprites for characters (one for now)
    - [ ] Finish stage
    - [ ] Pathing for sprites
    - [x] State machines for logic

### Low

- [ ] Deployment
    - [ ] Github pipeline
    - [x] Correct static building
    - [ ] Unocss removal? This plugin does nothing is swear
    - [ ] Linting issues
- [ ] Branding
    - [ ] Port existing information across from old website
        - [ ] Images
        - [ ] Descriptions etc.
    - [ ] Overlays
    - [x] Smaller scrollbar (Doesn't work on firefox or chrome?)
- Fixes
    - Bugs
    - Animations
    - Logical bugs (testing required). Things like searching using regex
    - Theming
- [ ] Tests
    - e2e
    - frontend
    - specs
- [ ] Mobile
    - Create side navbar
    - Fix logo overflow
- [ ] FAQ : TODO
    - [ ] Allow nesting of questions
    - [x] Add searching via tags
    - [x] Jump to top of page when redirected from /faq link
