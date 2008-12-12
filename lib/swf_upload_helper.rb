module SwfUploadHelper
  def swf_upload_area(title, options)
    "<div class='swfUploadArea'>
        <div class='buttonText' style='display:none'>#{title}</div>
        <div class='url' style='display:none'>#{options[:url]}</div>
        <div class='token' style='display:none'>#{form_authenticity_token}</div>
        <div class='session_id' style='display:none'>#{ActionController::Base.session[0][:session_key]}</div>
        <div class='filetypes' style='display:none'>#{options[:filetypes]}</div>
        <div class='buttonStyle' style='display:none'>#{options[:button_style]}</div>
        <div class='embedArea'>
            <div id='swfUploadButton'></div>
        </div>
        <ul class='uploadContainer'>
        </ul>
    </div>"
  end
end