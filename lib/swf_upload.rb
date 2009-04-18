module SwfUpload

  MIME_TYPES = {
    "gif" => "image/gif",
    "jpg" => "image/jpeg",
    "jpeg" => "image/jpeg",
    "png" => "image/png",
    "swf" => "application/x-shockwave-flash",
    "pdf" => "application/pdf",
    "sig" => "application/pgp-signature",
    "spl" => "application/futuresplash",
    "doc" => "application/msword",
    "ps" => "application/postscript",
    "torrent" => "application/x-bittorrent",
    "dvi" => "application/x-dvi",
    "gz" => "application/x-gzip",
    "pac" => "application/x-ns-proxy-autoconfig",
    "swf" => "application/x-shockwave-flash",
    "tar.gz" => "application/x-tgz",
    "tar" => "application/x-tar",
    "zip" => "application/zip",
    "mp3" => "audio/mpeg",
    "m3u" => "audio/x-mpegurl",
    "wma" => "audio/x-ms-wma",
    "wax" => "audio/x-ms-wax",
    "wav" => "audio/x-wav",
    "xbm" => "image/x-xbitmap",
    "xpm" => "image/x-xpixmap",
    "xwd" => "image/x-xwindowdump",
    "css" => "text/css",
    "html" => "text/html",
    "js" => "text/javascript",
    "txt" => "text/plain",
    "xml" => "text/xml",
    "mpeg" => "video/mpeg",
    "mov" => "video/quicktime",
    "avi" => "video/x-msvideo",
    "asf" => "video/x-ms-asf",
    "wmv" => "video/x-ms-wmv",
    "flv" => "video/x-flv"
  }

  def swf_upload_data
    @swf_upload_data ||= fix_mime_type(params[:Filedata]) if params[:Filedata]
  end

private

  def fix_mime_type(data)
    if !data.is_a?(File) && mime_type = MIME_TYPES[File.extname(data.original_filename).delete('.').downcase]
      data.content_type = mime_type
    end
    data
  end
end