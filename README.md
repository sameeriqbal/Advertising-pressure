# Google-lighthouse-custom-audit
# MISSION
We need a plugin to audit "Advertising pressure" in a page.
We want to measure
- the number of ads
- the ratio between ads occupation and total document size

# REQUIREMENTS
To identify the advertising you must use a list of selectors stored in a file (see attachments).
We will update the file regularly (in production), and the script must be robust enough to skip errors in the selectors file.
You should exclude from the count of adv any element smaller than 10x10px.
The javascript code must be efficient and as fast as possible.

# GOAL
We expect in the output the two signals and a weighted total score of the "advertising pressure"
# Run
lighthouse --config-path=custom-config.js https://yourURL or the url of the hosted file.
"# Advertising-pressure" 
