class EasySwfUploadGenerator < Rails::Generator::Base
  def manifest
    record do |m|
      m.file 'cgi_session_hack.rb',
             'config/initializers/cgi_session_hack.rb',
             :chmod => 0644,
             :collision => :force
      m.file 'swfupload.js',
             'public/javascripts/swfupload.js',
             :chmod => 0644,
             :collision => :force
      m.file 'swfupload.queue.js',
             'public/javascripts/swfupload.queue.js',
             :chmod => 0644,
             :collision => :force
      m.directory 'public/flash'
      m.file 'swfupload.swf',
             'public/flash/swfupload.swf',
             :chmod => 0644,
             :collision => :force
      m.file 'swfupload_plugin.js',
             'public/javascripts/swfupload_plugin.js',
             :chmod => 0644,
             :collision => :force
    end
  end
end
