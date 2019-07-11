
## Development
```
git clone ...
npm i
npm run start
```

### Add access tokens

- add .env file with:
```
TINYMCE_API_KEY=
CONTENTFUL_SPACE=
CONTENTFUL_SPACE_ACCESS_TOKEN=
```

- update .contentfulrc.json

### Move stylesheet to build folder

- Move editorStyles.css to build folder
- *You will need to have matching styles in your website to use the HTML outputted from the tinyMCE component.*

## Contentful
### Extension
- Create extension or use existing extension
- Change the self hosted url option to http://localhost:1234

### Content Model
If not already created, create content model containing content with custom apparence of your extension. 

### Content
Allow unsafe scripts to load when you go to the component, in Chrome this is located on the right of the url bar. 


## Production
```
npm run deploy
```

## Serve the application remotely
*Because contentful can only host a single file with a size less the 200kb. In most cases you will want to serve from a remote location. 
For example netlify, s3, etc.*

Update the self hosting url option in contentful extension settings to point to your remotely served application.


## Documentation
- [Offical TinyMCE React component](https://github.com/tinymce/tinymce-react)
- [UI Extensions SDK reference](https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/)



