module SwfUploadHelper
  def swf_upload_area(title, options)
    session_key = RAILS_GEM_VERSION < "2.3.0" ? ActionController::Base.session[0][:session_key] : ActionController::Base.session_options[:key]
    %Q{<div class="swfUploadArea">
        <div style="display:none">
          <div class="buttonText"></div>
          <div class="url">#{options[:url]}</div>
          <div class="token">#{CGI::escape(form_authenticity_token)}</div>
          <div class="session_key">#{session_key}</div>
          <div class="session_id">#{CGI::escape(cookies[session_key])}</div>
          <div class="filetypes">#{options[:filetypes]}</div>
          <div class="buttonStyle">#{options[:button_style]}</div>
          <div class="file_size_limit">#{options[:file_size_limit] || "40 MB"}</div>
          <div class="singleFile">#{options[:single_file] ? 'true' : 'false'}</div>
        </div>
        <div class="embedArea">
            <div class="embedButton">
              <input type="button" value="#{title}" />
              <div class="placeHolder" id="swfUploadButton"></div>
            </div>
        </div>
        <ul class="uploadContainer">
        </ul>
    </div>}
  end
end
