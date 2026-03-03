# CS website

## Use of AI

This project heavily relied on the use of AI to produce this website in the time frame of 5 days.
There is bound to be problems with files and tech debt from using AI, but this is a POC.
FYI: Went through all copilot tokens for the month the day I got copilot.

## TODOs

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
