/* Riot.js templating 0.9.4 | moot.it/riotjs | @license MIT | (c) 2013 Tero Piirainen, Moot Inc and other contributors. */
(function(top) {
	
  var $ = top.$,
  	  templates = {},  //Store templates for reference by name
  	  regEx = /\{\s*(\w+)\s*\}/g,
  	  compile = function (template) {
	  	//Here one could - Strip out <script...> ... </script> and strip out eval() if in events like on click.
  	  	return function(data){
  	  	  return typeof data === 'object' && template.replace(regEx, function(match) { return data[match] ? data[match] : ''; });
  	  	};
      };

  /* Render, store a template
   * This approach was needed as some browsers do not allow eval oriented calls: http://developer.chrome.com/extensions/contentSecurityPolicy.html
   * Provide a parameters object, 
   * { 
   *  name: 'the name to reference to access or store a template', 
   *  template: 'the template to store and/or depending on if data and a name is provided', 
   *  data: 'the data to use on the template provided or looked up by name'
   * } 	 
   */
  $.render = function(params) {
	var params = params || {}, name = params.name, template = params.template, data = params.data, process = null;
	  
	if(template) {
	  templates[name] = process = compile(template);
	} else if (name) {
	  process = templates[name];
	}
	  
	return process && process(data);
  };
    
})(window);