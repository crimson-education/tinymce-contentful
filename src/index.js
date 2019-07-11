import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { init } from "contentful-ui-extensions-sdk";
import { Editor } from "@tinymce/tinymce-react";
import {headerSectionTemplate, threeIconSectionTemplate, textAndImageSectionTemplate, emptySection, inlineSection} from './templates'

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue(),
      assetArreys: undefined,
      content: ''
    };

    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentDidMount() {
    const contentful = require("contentful");
    const client = contentful.createClient({
      space: "tcuhs00ixsl3",
      accessToken: "e7d06e839167259c30138f15bdb282433b692849bc1d8ce3be768a3969ba7ec3"
    });

    this.props.sdk.window.startAutoResizer();

    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    );
    
    client.getAssets({limit: 1000})
      .then((response) => {(
        this.setState({
          assetArreys: response.items
        }), () => console.log('state', this.state))
      }).then(() => console.log(this.state))

    this.setState({
      content: this.props.sdk.field.getValue()
    })

  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  handleEditorChange(content, editor) {
    this.setState({ content });
    this.props.sdk.field.setValue(content)

  }

  onExternalChange = content => {
    // this.setState({ content });
  };

  render() {
    const imagesArray = this.state.assetArreys;

    const editorOptions = {
      selector: "textarea",
      plugins:
        "preview powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter pageembed linkchecker fullpage fullscreen visualchars advcode",
      toolbar:
        "template | formatselect | bold italic strikethrough forecolor fontsizeselect | alignleft aligncenter alignright  | numlist bullist |  dark-background light-background Flip-sides half-width full-width addImage code",
      menu: {
        file: {title: 'File', items: 'newdocument preview styleprops' },
        edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall searchreplace'},
        insert: {title: 'Insert', items: 'template | addImage link media | charmap | insertdatetime'}, 
        tools: {title: 'Tools', items: 'spellchecker a11ycheck wordcount'},
        view: {title: 'Custom', items: 'light-background dark-background Flip-sides half-width full-width select-background fullwidth removesidepadding insertcta'},
      },
      menubar: 'file edit insert format tools view',
      color_map: [
        "232950",
        "navy",
        "656984",
        "stormGrey",
        "4f6987",
        "slate",
        "741443",
        "wine",
        "aa1e23",
        "red",
        "cd4b53",
        "pink",
        "88171c",
        "darkRed",
        "ed4b53",
        "salmon",
        "9f9f9f",
        "halfGrey",
        "6e6e6e",
        "grey",
        "babcc5",
        "stone",
        "dadae0",
        "chromium",
        "d3d4dc",
        "mischka",
        "f6f7fa",
        "whisper",
        "ffffff",
        "white",
        "2c3054",
        "blue",
        "d3d3d3",
        "alto",
        "54b159",
        "green",
        "00a896",
        "tiffany",
        "4a90e2",
        "sky",
        "f5991f",
        "cheddar"
      ],
      templates: [
        {
          title: "Header Section",
          description: "Header Section Description",
          content: headerSectionTemplate
        },
        {
          title: "Empty Section",
          description: "",
          content: emptySection
        },
        {
          title: "TextAndImageSection",
          description: "",
          content: textAndImageSectionTemplate
        },
        {
          title: "Three Icon Section",
          description: "",
          content: threeIconSectionTemplate
        },
        {
          title: "Inline Section",
          description: "",
          content: inlineSection
        },
      ],
      valid_children: "+body[style], +div[style]",
      spellchecker_language: 'en_gb',
      body_class: 'bodyClass',
      content_css: ".editorStyles.css",
      min_height: 1000,
      width: "100%",
      plugin_preview_width : 2000, 
      plugin_preview_height : "2000px !important",
      autoresize_overflow_padding: 50,
      image_class_list: [
        { title: "None", value: "" },
        { title: "Add Padding", value: "imagePadding" },
        { title: "Just Top and Bottom padding", value: "just-top-and-bottom-padding" }
      ],
      preview_styles: false,
      statusbar: false,
      image_advtab: true,
      image_uploadtab: true,
      visualblocks_default_state: false,
      
      setup: editor => {
        editor.ui.registry.addMenuItem("dark-background", {
          icon: 'highlight-bg-color',
          text: 'Dark Background Colour',
          onAction: function(_) {
            tinymce.activeEditor.dom.setStyle(tinymce.activeEditor.dom.select('.bodyClass'), 'background-color', '#293057');
          }
        });
        editor.ui.registry.addMenuItem("light-background", {
          icon: 'highlight-bg-color',
          text: 'Light Background Colour',
          onAction: function(_) {
            tinymce.activeEditor.dom.setStyle(tinymce.activeEditor.dom.select('.bodyClass'), 'background-color', '#f6f7fa');
          }
        });
        editor.ui.registry.addMenuItem("select-background", {
          icon: 'highlight-bg-color',
          text: 'select-background',
          onAction: function(_) {
            tinymce.activeEditor.dom.select('img');
          }
        });
        editor.ui.registry.addMenuItem("Flip-sides", {
          icon: 'flip-horizontally',
          text: 'Reverse Content Order',
          onAction: function(_) {
            tinymce.activeEditor.dom.toggleClass(tinymce.activeEditor.dom.select('.floatContainer'), 'reverseFloatDirection');
          }
        });
        editor.ui.registry.addMenuItem("half-width", {
          text: "Image Half Width",
          onAction: function(_) {
            tinymce.activeEditor.dom.setStyle(tinyMCE.activeEditor.selection.getNode(), 'width', '50%');
          }
        });
        editor.ui.registry.addMenuItem("full-width", {
          text: "Image Full Width",
          onAction: function(_) {
            tinymce.activeEditor.dom.setStyle(tinyMCE.activeEditor.selection.getNode(), 'width', '100%');
          }
        });
        editor.ui.registry.addMenuItem("removesidepadding", {
          text: "removesidepadding",
          onAction: function(_) {
            tinymce.activeEditor.dom.setStyle(tinyMCE.activeEditor.selection.getNode(), 'padding-left', '0');
            tinymce.activeEditor.dom.setStyle(tinyMCE.activeEditor.selection.getNode(), 'padding-right', '0');
          }
        });
        editor.ui.registry.addMenuItem("fullwidth", {
          text: "fullwidth",
          onAction: function(_) {
            tinyMCE.activeEditor.dom.addStyle('.body {background: blue !important}');
          }
        });
        editor.ui.registry.addMenuItem("insertcta", {
          text: "insertcta",
          onAction: function(_) {
            tinyMCE.activeEditor.insertContent(`
            <a href="http://www.google.com" class="ctaBtn__link">
                Link Text
            </a>
        `);
          }
        });
        editor.ui.registry.addMenuItem('addImage', {
          icon: 'gallery',
          text: 'Add Image',
          onAction: () => {
            editor.windowManager.open({
              title: 'Contentful Images',
              size: 'large',
              body: {
                type: 'tabpanel',
                tabs: [ 
                  {
                    name: 'Page 1',
                    title: 'Page 1',
                    items: [
                      {
                        type: 'grid',
                        columns: 8, 
                        items: imagesArray.filter((v, i) => i < 100 ).map((image, i) => {
                          return {
                            type: 'button',
                            text: `<img src="${image.fields.file.url}" style='width: 75px;' />`,
                            primary: false,
                            name: image.fields.file.url,
                          }
                        },
                        )
                      }
                    ]
                  },
                  {
                    name: 'Page 2',
                    title: 'Page 2',
                    items: [
                      {
                        type: 'grid', 
                        columns: 8, 
                        items: imagesArray.filter((v, i) => i > 99 && i < 200 ).map((image, i) => {
                          return {
                            type: 'button', 
                            text: `<img src="${image.fields.file.url}" style='width: 100px;' />`,
                            primary: false,
                            name: image.fields.file.url,
                          }
                        }
                        )
                      },
                    ]
                  },
                  {
                    name: 'Page 3',
                    title: 'Page 3',
                    items: [
                      {
                        type: 'grid', 
                        columns: 8, 
                        items: imagesArray.filter((v, i) => i > 199 && i < 300 ).map((image, i) => {
                          return {
                            type: 'button',
                            text: `<img src="${image.fields.file.url}" style='width: 100px;'  />`,
                            primary: false,
                            name: image.fields.file.url,
                          }
                        }
                        )
                      },
                    ]
                  },
                  {
                    name: 'Page 4',
                    title: 'Page 4',
                    items: [
                      {
                        type: 'grid', 
                        columns: 8, 
                        items: imagesArray.filter((v, i) => i > 299 && i < 400  ).map((image, i) => {
                          return {
                            type: 'button',
                            text: `<img src="${image.fields.file.url}" style='width: 100px;' />`,
                            primary: false,
                            name: image.fields.file.url,
                          }
                        }
                        )
                      },
                    ]
                  },
                ] 
              },
              buttons: [
                {
                  type: 'custom',
                  name: 'lastpage',
                  text: 'Done',
                  disabled: false
                }
              ],
              onAction: (dialogApi, details) => {
                var data = dialogApi.getData();
                console.log(details)
            
                var result = `details`
                console.log(result);
                tinymce.activeEditor.execCommand('mceInsertContent', false, `<img src="${details.name}" />`);
            
                dialogApi.close();
              }
            })
          }
        })


      },
    }
    

    return (
      Array.isArray(imagesArray) && <Editor
        apiKey="0z44nt5lrcu0nv0jwlkd4sihumgjma7pu0zbvo1g4aoq4f5e"
        value={this.state.content} 
        onEditorChange={this.handleEditorChange} 
        init={editorOptions}
      />
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"));
});



