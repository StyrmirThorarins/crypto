from flask import jsonify
import dash
import dash_html_components as html

app = dash.Dash(__name__,url_base_pathname='/app/')
server = app.server

app.layout = html.Div('show this content')

@server.route('/')
def route1():
    return jsonify({'message':'this is the first route'})

@server.route('/test')
def route2():
    return jsonify({'message':'this is the second route'})

if __name__=='__main__':
    server.run(debug=True,port=8050)