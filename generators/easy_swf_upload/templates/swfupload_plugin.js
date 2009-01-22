var SwfuCookie = {
	set: function(name, value, daysToExpire) {
		var expire = '';
		if (daysToExpire != undefined) {
			var d = new Date();
			d.setTime(d.getTime() + (86400000 * parseFloat(daysToExpire)));
			expire = '; expires=' + d.toGMTString();
		}
		return (document.cookie = escape(name) + '=' + escape(value || '') + expire);
	},
	get: function(name) {
		var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
		return (cookie ? unescape(cookie[2]) : null);
	},
	erase: function(name) {
		var cookie = Cookie.get(name) || true;
		Cookie.set(name, '', -1);
		return cookie;
	},
	accept: function() {
		if (typeof navigator.cookieEnabled == 'boolean') {
			return navigator.cookieEnabled;
		}
		Cookie.set('_test', '1');
		return (Cookie.erase('_test') === '1');
	}
}

var flashUploader = {
	init: function(block, index) {
		this.swfUploadBlock = block
		this.postParams = new Hash()

		this.postParams.set('authenticity_token', this.swfUploadBlock.down('.token').innerHTML)
		this.postParams.set(this.swfUploadBlock.down('.session_key').innerHTML, this.swfUploadBlock.down('.session_id').innerHTML)

		this.settings = {
			upload_url: this.swfUploadBlock.down('.url').innerHTML,
			post_params: this.postParams.toObject(),
			use_query_string: true,
			
			file_size_limit : "40 MB",
			file_types : this.swfUploadBlock.down('.filetypes').innerHTML,
			file_types_description : "",
			file_upload_limit : "0",

			file_dialog_complete_handler: flashUploader.fileDialogComplete,
			file_dialog_start_handler: flashUploader.selectFiles,
			upload_start_handler: flashUploader.myUploadStart,
			upload_progress_handler : flashUploader.uploadProgress,
			upload_error_handler : flashUploader.uploadError,
			upload_success_handler : flashUploader.uploadSuccess,
			upload_complete_handler : flashUploader.uploadComplete,
			button_placeholder_id : this.swfUploadBlock.down('.embedArea').down('div').readAttribute('id'),
			button_width: 180,
			button_height: 18,
			button_text : '<span class="button">'+this.swfUploadBlock.down('.buttonText').innerHTML+'</span>',
			button_text_style : '.button { '+ this.swfUploadBlock.down('.buttonStyle').innerHTML +' }',
			button_text_top_padding: 0,
			button_text_left_padding: 0,
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_cursor: SWFUpload.CURSOR.HAND,
			custom_settings : {
					container : this.swfUploadBlock.down('.uploadContainer'),
					current_file_index: 0,
					filePrefix: index
			},
			flash_url : "/flash/swfupload.swf",
			debug: false
		}

		this.swfu = new SWFUpload(this.settings);
	},
	
	cancelQueue: function(id) {

	},

	fileDialogComplete: function(filesSelected, filesQueued) {
		for (i = 0; i < filesQueued; i++) {
			var template = new Template('<li id="#{prefix}_file_#{id}"><div class="progress" style="width:1%"></div><h6>#{title}</h6></li>')
			var show = {
				title: this.getFile(i)["name"], 
				id: (this.customSettings.current_file_index + this.getFile(i)["index"]),
				prefix: this.customSettings.filePrefix
			}
			
			this.customSettings.container.insert(template.evaluate(show))
		}
		this.customSettings.current_file_index += i
		this.startUpload()
	},
	
	uploadProgress: function(file, bytesLoaded, bytesTotal) {
		$(this.customSettings.filePrefix + '_file_' + file["index"]).down('div').setStyle({width: (bytesLoaded * 100 / bytesTotal + '%')})
	},
	
	uploadError: function(file, errorCode, message) {
		alert(message)
	},
	uploadSuccess: function(file, serverData) {
		$(this.customSettings.filePrefix + '_file_'+file["index"]).down('div').setStyle({width: '100%'})
		
		$(this.customSettings.filePrefix + '_file_'+file["index"]).fade({ duration: 0.5, afterFinish: function() {
			$(this.customSettings.filePrefix + '_file_'+file["index"]).remove()
		}.bind(this) });
		eval(serverData)
	},
	uploadComplete: function(file) {
		if (this.getStats().files_queued > 0) {
			this.startUpload()
		}
	}
}

Event.observe(window, 'load', function() {
	$$('.swfUploadArea').each(function(element, index) {
		flashUploader.init(element, index)
	})
})