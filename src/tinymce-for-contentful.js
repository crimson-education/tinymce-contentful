window.contentfulExtension.init(function(api) {
  function tinymceForContentful(api) {
    api.window.startAutoResizer();

    function tweak(param) {
      var t = param.trim();
      if (t === "false") {
        return false;
      } else if (t === "") {
        return undefined;
      } else {
        return t;
      }
    }

    var tb = tweak(api.parameters.instance.toolbar);
    var mb = tweak(api.parameters.instance.menubar);

    tinymce.init({
      selector: "#editor",
      plugins: 'preview powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter pageembed linkchecker', //api.parameters.instance.plugins,
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat ', //tb,
      menubar: mb,
      valid_children: '+body[style], +div[style]',
      content_css: 'https://crimson-marketing-files.s3-ap-southeast-2.amazonaws.com/tinymce-contentful/editor.css',
      max_height: 800,
      min_height: 800,
      autoresize_bottom_margin: 15,
      resize: false,
      init_instance_callback : function(editor) {
        var listening = true;

        function getEditorContent() {
          return editor.getContent() || '';
        }

        function getApiContent() {
          return api.field.getValue() || '';
        }

        function setContent(x) {
          var apiContent = x || '';
          var editorContent = getEditorContent();
          if (apiContent !== editorContent) {
            //console.log('Setting editor content to: [' + apiContent + ']');
            editor.setContent(apiContent);
          }
        }

        setContent(api.field.getValue());

        api.field.onValueChanged(function(x) {
          if (listening) {
            setContent(x);
          }
        });

        function onEditorChange() {
          var editorContent = getEditorContent();
          var apiContent = getApiContent();

          if (editorContent !== apiContent) {
            //console.log('Setting content in api to: [' + editorContent + ']');
            listening = false;
            api.field.setValue(editorContent).then(function() {
              listening = true;
            }).catch(function(err) {
              console.log("Error setting content", err);
              listening = true;
            });
          }
        }

        var throttled = _.throttle(onEditorChange, 500, {leading: true});
        editor.on('change keyup setcontent blur', throttled);
      }
    });
  }

  function loadScript(src, onload) {
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    script.onload = onload;
    document.body.appendChild(script);
  }

  var sub = location.host == "contentful.staging.tiny.cloud" ? "cloud-staging" : "cloud";
  var apiKey = api.parameters.installation.apiKey || 'cvxj4679fw07btxjiup8mv09lw9noy9hzl4ccolmbbnred8e';
  var channel = api.parameters.installation.channel || '5';
  var tinymceUrl = "https://" + sub + ".tinymce.com/" + channel + "/tinymce.min.js?apiKey=" + apiKey;

  loadScript(tinymceUrl, function() {
    tinymceForContentful(api);
  });
});
