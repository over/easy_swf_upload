var SwfuCookie = {
	set: function(name, value, daysToExpire) {
		var expire = ''
		if (daysToExpire != undefined) {
			var d = new Date()
			d.setTime(d.getTime() + (86400000 * parseFloat(daysToExpire)))
			expire = '; expires=' + d.toGMTString()
		}
		return (document.cookie = escape(name) + '=' + escape(value || '') + expire)
	},
	get: function(name) {
		var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'))
		return (cookie ? unescape(cookie[2]) : null)
	},
	erase: function(name) {
		var cookie = Cookie.get(name) || true
		Cookie.set(name, '', -1)
		return cookie
	},
	accept: function() {
		if (typeof navigator.cookieEnabled == 'boolean') {
			return navigator.cookieEnabled
		}
		Cookie.set('_test', '1')
		return (Cookie.erase('_test') === '1')
	}
}

var FlashUploader = Class.create({
	initialize: function(block, index) {
		this.index = index
		this.swfUploadBlock = block
		this.container = block.down('.uploadContainer')
		this.postParams = new Hash()

		this.postParams.set('authenticity_token', this.swfUploadBlock.down('.token').innerHTML)
		this.postParams.set(this.swfUploadBlock.down('.session_key').innerHTML, this.swfUploadBlock.down('.session_id').innerHTML)
		this.fileSizeLimit = this.container.down(".fileSizeLimit")
		
		this.settings = {
			upload_url: this.swfUploadBlock.down('.url').innerHTML,
			post_params: this.postParams.toObject(),
			use_query_string: true,

			file_size_limit: this.swfUploadBlock.down('.file_size_limit').innerHTML,
			file_types: this.swfUploadBlock.down('.filetypes').innerHTML,
			file_types_description: "",
			file_upload_limit: 0,

			file_dialog_complete_handler: this.fileDialogComplete.bind(this),
			upload_progress_handler: this.uploadProgress.bind(this),
			upload_error_handler: this.uploadError.bind(this),
			upload_success_handler: this.uploadSuccess.bind(this),
			upload_complete_handler: this.uploadComplete.bind(this),
			button_placeholder_id: this.swfUploadBlock.down('.embedArea').down('div.placeHolder').readAttribute('id'),
			button_width: 180,
			button_height: 18,
			button_text: '<span class="button">' + this.swfUploadBlock.down('.buttonText').innerHTML + '</span>',
			button_text_style: '.button { '+ this.swfUploadBlock.down('.buttonStyle').innerHTML +' }',
			button_text_top_padding: 0,
			button_text_left_padding: 0,
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_cursor: SWFUpload.CURSOR.HAND,
			button_action: (this.swfUploadBlock.down('.singleFile').innerHTML == 'true') ? SWFUpload.BUTTON_ACTION.SELECT_FILE : SWFUpload.BUTTON_ACTION.SELECT_FILES,
			flash_url: "/flash/swfupload.swf",
			debug: false
		}

		this.swfu = new SWFUpload(this.settings)
		this.currentFileIndex = 0
	},

	cancelQueue: function(id) {
	},

	fileDialogComplete: function(filesSelected, filesQueued) {
		var template = new Template('<li id="#{id}"><h6>#{title}</h6><div class="bar"><div class="progress" style="width:0"></div></div></li>')

		filesQueued.times(function(i) {
			var file = this.swfu.getFile(this.currentFileIndex++)
			this.container.insert(template.evaluate({id: this.fileDomId(file), title: file.name.escapeHTML()}))
		}.bind(this))

		this.swfu.startUpload()
	},

	uploadProgress: function(file, bytesLoaded, bytesTotal) {
		$(this.fileDomId(file)).down('.progress').setStyle({width: (bytesLoaded * 100 / bytesTotal + '%')})
	},

	uploadError: function(file, errorCode, message) {
		alert(message)
	},
	uploadSuccess: function(file, serverData) {
		this.uploadProgress(file, 1, 1)

		$(this.fileDomId(file)).fade({duration: 0.5, afterFinish: function(obj) {
			obj.element.remove()
		}.bind(this)})
		try {
			eval(serverData)
		} catch (e) {
			alert(e)
		}
	},
	uploadComplete: function(file) {
		if (this.swfu.getStats().files_queued > 0) {
			this.swfu.startUpload()
		}
	},

	fileDomId: function(file){
		return 'fu_' + this.index + '_file_' + file.index
	}
})

FlashUploader.init = function() {
	$$('.swfUploadArea').each(function(element, index) {
		if (!element.flashUploader) {
			element.flashUploader = new FlashUploader(element, index)
			
			buttonWrap = element.down(".embedButton")
			object = element.down('object')
			
			buttonWrap.relativize()
			object.absolutize()
			
			object.setStyle({
				left: 0,
				top: 0,
				width: buttonWrap.down('input').getWidth() + 'px',
				height: buttonWrap.down('input').getHeight() + 'px'
			})
		}
	})
}

Event.observe(window, 'load', function(){
	FlashUploader.init()
})
