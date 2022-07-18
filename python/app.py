# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

import logging
from dash import Dash, html, dcc
import plotly.express as px
import pandas as pd
import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

app = Dash(__name__)

# assume you have a "long-form" data frame
# see https://plotly.com/python/px-arguments/ for more options
df_test = pd.DataFrame({
    "Fruit": ["Apples", "Oranges", "Bananas", "Apples", "Oranges", "Bananas"],
    "Amount": [4, 1, 2, 2, 4, 5],
    "City": ["SF", "SF", "SF", "Montreal", "Montreal", "Montreal"]
})

fig_test = px.bar(df_test, x="Fruit", y="Amount", color="City", barmode="group")

# fetch data
data = requests.get('https://min-api.cryptocompare.com/data/v2/histoday', params={'fsym': 'BTC', 'tsym': 'USD', 'limit': '10', 'api_key': os.getenv("CRYPTOCOMPARE_API_KEY")})

df = pd.DataFrame(data.json()['Data']['Data'])
print('df\n', df)

fig = px.line(df, x='time', y="open")
# fig.show()


app.layout = html.Div(children=[
    html.H1(children='Hello Dash'),

    html.Div(children='''
        Dash: A web application framework for your data.
    '''),

    html.Div(children=data.text),

    dcc.Graph(
        id='example-graph',
        figure=fig
    )
])

if __name__ == '__main__':
    app.run_server(debug=True)
