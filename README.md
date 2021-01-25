# Plant-for-the-Planet Widgets

Widget to extend profiles at plant-for-the-planet.org

## Get Started

Docs will be updated soon...


## Properties 

<table border="1">
        <tr>
            <td>#</td>
            <td><b>Prop Name</b></td>
            <td><b>Functionality</b></td>
            <td><b>Values</b></td>
            <td><b>Default Value</b></td>
            <td><b>Required/Optional</b></td>
        </tr>
        <tr>
            <td>1</td>
            <td>user</td>
            <td>Unique GUID or slug of the user which will be used to fetch the data.</td>
            <td>For eg. 'prf_h6smcMDN23Qet1CP7BEplM60'</td>
            <td>NULL</td>
            <td>Required</td>
        </tr>
        <tr>
            <td>2</td>
            <td>primaryColor</td>
            <td>The color which is applied to the button and the progress of the tree counter</td>
            <td>Hex code, RGB, or RGBA</td>
            <td>Default: "#68b030"</td>
            <td>Optional</td>
        </tr>
        <tr>
            <td>3</td>
            <td>counterBackgroundColor</td>
            <td>The color which is applied to the background of the tree counter</td>
            <td>Hex code, RGB, or RGBA</td>
            <td>Default: "#23519b"</td>
            <td>Optional</td>
        </tr>
        <tr>
            <td>4</td>
            <td>theme</td>
            <td>Changes the theme of the widget</td>
            <td>"light", "dark", OR "startrek"</td>
            <td>Default: light</td>
            <td>Optional</td>
        </tr>
        <tr>
            <td>5</td>
            <td>community</td>
            <td>Decide whether to show the received trees or not</td>
            <td>true OR false</td>
            <td>Default: false</td>
            <td>Optional</td>
        </tr>
        <tr>
            <td>6</td>
            <td>locale</td>
            <td>Change the language of the widget</td>
            <td>de = German, en = English, more coming soon</td>
            <td>Default: en</td>
            <td>Optional</td>
        </tr>
    </table>

## Get Started - Local

1. Clone this repo
2. `npm install`
3. `npm run dev`
4. Open a browser to `https://localhost:5000`

