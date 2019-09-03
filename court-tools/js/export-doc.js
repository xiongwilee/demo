if (typeof jQuery !== 'undefined' && typeof saveAs !== 'undefined') {
  ;(function($) {
    $.fn.wordExport = function(fileName) {
      fileName =
        typeof fileName !== 'undefined' ? fileName : 'jQuery-Word-Export'
      var static = {
        mhtml: {
          top: '<!DOCTYPE html>\n<html>\n_html_</html>',
          head:
            '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\n_styles_\n</style>\n</head>\n',
          body:
            '<body lang=ZH-CN style="text-justify-trim:punctuation">_body_</body>',
        },
      }
      var options = {
        maxWidth: 624,
      }
      // Clone selected element before manipulating it
      var markup = $(this).clone()

      // Remove hidden elements from the output
      markup.each(function() {
        var self = $(this)
        if (self.is(':hidden')) self.remove()
      })

      // Embed all images using Data URLs
      var images = Array()
      var img = markup.find('img')
      for (var i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth)
        var h = img[i].height * (w / img[i].width)
        // Create canvas for converting image to data URL
        var canvas = document.createElement('CANVAS')
        canvas.width = w
        canvas.height = h
        // Draw image to canvas
        var context = canvas.getContext('2d')
        context.drawImage(img[i], 0, 0, w, h)
        // Get data URL encoding of image
        var uri = canvas.toDataURL('image/png')
        $(img[i]).attr('src', img[i].src)
        img[i].width = w
        img[i].height = h
        // Save encoded image to array
        images[i] = {
          type: uri.substring(uri.indexOf(':') + 1, uri.indexOf(';')),
          encoding: uri.substring(uri.indexOf(';') + 1, uri.indexOf(',')),
          location: $(img[i]).attr('src'),
          data: uri.substring(uri.indexOf(',') + 1),
        }
      }

      // Prepare bottom of mhtml file with image data
      var mhtmlBottom = '\n'
      for (var i = 0; i < images.length; i++) {
        mhtmlBottom += '--NEXT.ITEM-BOUNDARY\n'
        mhtmlBottom += 'Content-Location: ' + images[i].location + '\n'
        mhtmlBottom += 'Content-Type: ' + images[i].type + '\n'
        mhtmlBottom +=
          'Content-Transfer-Encoding: ' + images[i].encoding + '\n\n'
        mhtmlBottom += images[i].data + '\n\n'
      }
      mhtmlBottom += '--NEXT.ITEM-BOUNDARY--'

      //TODO: load css from included stylesheet
      var styles =
        '@font-face {font-family:宋体;} @font-face {font-family:"Cambria Math";' +
        'panose-1:2 4 5 3 5 4 6 3 2 4;}' +
        '@font-face' +
        '{font-family:方正小标宋简体;}' +
        '@font-face' +
        '{font-family:仿宋;}' +
        '@font-face' +
        '{font-family:仿宋_GB2312;}' +
        '@font-face' +
        '{font-family:"@宋体";}' +
        '@font-face' +
        '{font-family:"@仿宋";}' +
        '@font-face' +
        '{font-family:"@方正小标宋简体";}' +
        '@font-face' +
        '{font-family:"@仿宋_GB2312";}' +
        '/* Style Definitions */' +
        'p.MsoNormal, li.MsoNormal, div.MsoNormal' +
        '{margin:0cm;' +
        'margin-bottom:.0001pt;' +
        'text-align:justify;' +
        'text-justify:inter-ideograph;' +
        'font-size:10.5pt;' +
        'font-family:"Times New Roman",serif;}' +
        'p.MsoHeader, li.MsoHeader, div.MsoHeader' +
        '{margin:0cm;' +
        'margin-bottom:.0001pt;' +
        'text-align:center;' +
        'layout-grid-mode:char;' +
        'border:none;' +
        'padding:0cm;' +
        'font-size:9.0pt;' +
        'font-family:"Calibri",sans-serif;}' +
        'p.MsoFooter, li.MsoFooter, div.MsoFooter' +
        '{margin:0cm;' +
        'margin-bottom:.0001pt;' +
        'layout-grid-mode:char;' +
        'font-size:9.0pt;' +
        'font-family:"Times New Roman",serif;}' +
        '.MsoChpDefault' +
        '{font-size:10.5pt;' +
        'font-family:"Calibri",sans-serif;}' +
        '/* Page Definitions */' +
        '@page WordSection1' +
        '{size:595.3pt 841.9pt;' +
        'margin:102.05pt 76.55pt 102.05pt 76.55pt;' +
        'layout-grid:15.6pt;}' +
        'div.WordSection1' +
        '{page:WordSection1;}'

      // Aggregate parts of the file together
      var fileContent =
        static.mhtml.top.replace(
          '_html_',
          static.mhtml.head.replace('_styles_', styles) +
            static.mhtml.body.replace('_body_', markup.html())
        ) + mhtmlBottom

      // Create a Blob with the file contents
      // var blob = new Blob([fileContent], {
      //   type: 'application/msword;charset=utf-8',
      // })
      // saveAs(blob, fileName + '.doc')
      return fileContent
    }
  })(jQuery)
} else {
  if (typeof jQuery === 'undefined') {
    console.error('jQuery Word Export: missing dependency (jQuery)')
  }
  if (typeof saveAs === 'undefined') {
    console.error('jQuery Word Export: missing dependency (FileSaver.js)')
  }
}
