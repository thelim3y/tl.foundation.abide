// Foundation uses jQuery
// Assumes jQuery and Foundation has already been initialized
(function($) {
	var attrs = [
		'abideMaxLength',
		'abideMinLength',
		'abideRequired',
		'abidePattern'
	],
	getDataAttrs = function($el) {
		var da = {};
			
		for(var i = 0, j = attrs.length; i < j; i ++) {
			da[attrs[i]] = {};
			da[attrs[i]].val = $el.data(attrs[i]);
			da[attrs[i]].error = $el.data(attrs[i] + 'Err');
		}
			
		return da;
	};
	
	if(Foundation === undefined) {
		throw('This abide extension requires Foundation to be initialized first');
		return;
	}

	
	// There regexs are help in Foundation as regexp object, I'm keeping them as strings so as to make the validation code slightly less verbose
	
	// Most characters in a name not including special characters TODO: add special characters if needed (one day)
	Foundation.libs.abide.settings.patterns.tl_name = "^[-'\. a-zA-Z]+$";
	// Username regex
	Foundation.libs.abide.settings.patterns.tl_username = "^[-_\. a-zA-Z0-9]+$";
	// xxxxx or xxxxx-xxxx
	Foundation.libs.abide.settings.patterns.tl_usa_postcode = "^\\d{5}(-\\d{4})?$";
	// Should match (xxx) or xxx and any combination of - . space or nospace between numbers
	Foundation.libs.abide.settings.patterns.tl_usa_telephone = "^[(]?[2-9]{3}[)]?[-\. ]?[0-9]{3}[-\. ]?[0-9]{4}$";

	Foundation.libs.abide.settings.validators.tlGenericValidator = function(el, required, parent) {
		var $el = $(el),
			elStr = $el.val(),
			$err = $(parent).find('small.error'),
			dataAttrs;
	
		dataAttrs = getDataAttrs($el);
	
		if(required && elStr.length == 0) {
			$err.html(dataAttrs.abideRequired.error);
			return false;
		}
	
		if(dataAttrs.abideMinLength.val !== undefined) {
			if(dataAttrs.abideMinLength.val > elStr.length) {
				$err.html(dataAttrs.abideMinLength.error);
				return false;
			}
		}
	
		if(dataAttrs.abideMaxLength.val !== undefined) {
			if(dataAttrs.abideMaxLength.val < elStr.length) {
				$err.html(dataAttrs.abideMaxLength.error);
				return false;
			}
		}
	
		if(dataAttrs.abidePattern.val !== undefined) {
			var dataRegExp = dataAttrs.abidePattern.val;
			
			// Is the data-abide-pattern a named foundation pattern?
			// Yeah yeah hard coded dunno what else to do
			if(Foundation.libs.abide.settings.patterns[dataRegExp] !== undefined) {
				dataRegExp = Foundation.libs.abide.settings.patterns[dataRegExp];
			}

			if(!new RegExp(dataRegExp).test(elStr)) {
				$err.html(dataAttrs.abidePattern.error);
				return false;
			}
		}
	
	    return true;
	}
})(jQuery);
