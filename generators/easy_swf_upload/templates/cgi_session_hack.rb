class CGI::Session
  # allows getting session_id from query string if cookie_only is set to false
  alias original_initialize initialize

  def initialize(cgiwrapper, option = {})
    unless option['cookie_only']
      session_key = option['session_key'] || '_session_id'

      env_table = cgiwrapper.send(:env_table) #todo find correct way to do this
      session_id = [
        env_table['QUERY_STRING'],
        env_table['REQUEST_URI'][/\?(.+)/, 1]
      ].collect do |s|
        s[/#{session_key}=([^&]{32,})/, 1] if s
      end.compact.first

      if session_id
        cgiwrapper.instance_variable_set(:@cookies, {session_key => [CGI.unescape(session_id)]})
      end
    end

    original_initialize(cgiwrapper, option)
  end
end