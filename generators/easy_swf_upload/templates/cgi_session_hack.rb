#todo: Check GEM version in generator, split to different files

if RAILS_GEM_VERSION < '2.3.0'
  class CGI::Session
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
else
  require 'rack/utils'

  class FlashSessionCookieMiddleware
    def initialize(app)
      @app = app
      @session_key = ActionController::Base.session_options[:key]
    end

    def call(env)
      if env['HTTP_USER_AGENT'] =~ /^(Adobe|Shockwave) Flash/
        params = ::Rack::Utils.parse_query(env['QUERY_STRING'])
        env['HTTP_COOKIE'] = [ @session_key, params[@session_key] ].join('=').freeze unless params[@session_key].nil?
        env['QUERY_STRING'] = "authenticity_token=#{params['authenticity_token']}"
      end
      @app.call(env)
    end
  end

  ActionController::Dispatcher.middleware.insert_before(ActionController::Base.session_store, FlashSessionCookieMiddleware)
end
