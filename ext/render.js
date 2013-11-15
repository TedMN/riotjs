/* Riot.js templating 0.9.4 | moot.it/riotjs | @license MIT | (c) 2013 Tero Piirainen, Moot Inc and other contributors. */
(function(top) {
	
  var $ = top.$,
 	  regEx = /\{\s*(\w+)\s*\}/g; //Store here as it is more efficient, not compiled every time.

  //Option 1 -- with storage and pass by reference, very compact when minified.
  var templates = {}, //When minified takes about as much space as storing in this or on compile function
  	  compile = function (template) {  //Store here to avoid being defined every time render is called
	  	return function(data){
  	  	  return $.isObject(data) && template.replace(regEx, function(match) { return data[match] || ''; });
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
  render = function(params) {
	var params = params || {}, name = params.name, template = params.template, data = params.data, process = null;
	
	if(template) {
	  templates[name] = process = compile(template);
	} else if (name) {
	  process = templates[name];
	}
	
	return process && process(data);
  };
	
  //Option 2
  //Argue that template management is the job of the developer, because what if they load 300 templates, should I save all of them, memory management, etc.
  $.renderer = function(template) {  //Store here to avoid being defined every time render is called
	return function(data){
 	  return typeof data === 'object' && template.replace(regEx, function(tag, match) { return data[match] || ''; });
 	}; 
  };
  
  //Option 3
  //Super minimal but solid, regEx still defined in scope.
  $.render = function(data, template){
    return typeof data === 'object' && typeof template === 'string' && template.replace(regEx, function(tag, match) { return data[match] || ''; });
  };

  //Option 4
  //Super minimal, with jQuery, supports method chaining regEx still defined in scope.
  $.render = function(template){
	var output = [];
	$(this).each(function (i, element) {
		if(output$.isObject(data) && typeof template === 'string')
			output = template.replace(regEx, function(tag, match) { return data[match] || ''; });
	});
    return $(output.join(''));
  };
  
  //Option 5  
  //Advanced option, support and coined data driven template processing, use the structure of the data to loop.
  //This drives a simple implementation and syntax, give me a boolean it is conditional
  //pre render prep for render or prender
  var regEx = /(\{\s*(\w+)\s*\})/g;
  
  //Supports simple conditional, looping on an array, and object scope change
  //{ in element } { out }
  //{ if compare 'with' } { fi } -- NOT YET
  //{ if compare } { fi }
  //{ each elements } { end }
  
  var regEx = /(\{\s*[\w+\s*]+\})/g; //Now matches multi-argument tags
  $.prender = function(template) {
	  var template = template.split(regEx); //Split into tokens for efficient processing, reuse.
	  
	  /* The match function may actually be netting a couple of extra characters when minified vs just in-lining as it is called only 6 times. Maybe 5-10 character difference.*/
	  function match(off, token0, expect) { 
        return (!off && token0 === expect);
	  };
	  
	  return function(input){
		var state = { d: input || {} }, blocks = [], output = [], token, tokens, token0, dataToken1, i = 0;
		  
		while((token = template[i++]) != null) { //The != null, needed as there are '', could remove in template process.
		
			if(token[0] === '{') {
			  
			  tokens = token.slice(1, -1).trim().split(' '); //Now the arguments as tokens
			  
			  token0 = tokens[0];
			  
			  /* value is undefined or the value of the property within the data that matched */
			  dataToken1 = state.d && state.d[tokens[1]];
			  
			  /* state object, d => data, 
			  			       h => hide/(is false if), 
			  			       on => loop on, 
			  			       at => loop from template position forward. */  
			  
			  if(token0 === 'if') 
				  blocks.push(state = {d: state.d, h: state.h ? true : !dataToken1}); 
			      /* If already a false if block then just push another to the stack as we still need to balance the {fi} statements */ 
			  
			  else if(token0 === 'fi' || match(state.h, token0, 'out') || (match(state.h, token0, 'end') && state.on.length === 0)) 
				  /* Not checking state.on is null before length because this is would mean end was called at the wrong place for each */
				  state = blocks.pop();
			  	  /* Since we are always tracking, just pop off and set to current state */

			  else if(match(state.h, token0, 'each')) 
				  blocks.push(state = {d: dataToken1, at: i, on: 0});
			  	  /* Assignment and pushing in one statement so no curly brackets required */ 
			  
			  else if(match(state.h, token0, 'in')) 
				  blocks.push(state = {d: dataToken1});
			  
			  else if(match(state.h, token0, 'end')) {
				  if(!state.on.empty())  
			  			state = {
			  					d: state.on.pop(), //Effectively increments loop. 
			  					on: state.on, 
			  					at: state.at };
			  	  else
			  			state = blocks.pop();
			  } else 
				 (token0 && output.push(state.d[token0]));
			     /* Could move up to be first, but that would cost lines of code. */
			  
			} else if(!state.h)
			  output.push(token);
			  /* Just output a normal string if it is not a {...} token */
		}
		
		return output.join(''); 
	  };
  };
	
})(window);