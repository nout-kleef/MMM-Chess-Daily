# MMM-Chess-Daily

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Todo: Insert description here!

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-Chess-Daily',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options
<table>
    <tr><th>Option</th><th>Description</th></tr>
    <tr>
        <td><code>theme</code></td>
        <td>
            <i>Optional</i> Pick a theme for your chess pieces.<br>
            <b>Type:</b> <code>string</code><br>
            <b>Default:</b> <code>"classic"</code><br>
            All themes that are available on chess.com are supported:<br>
            <table>
                <tr>
                    <td><code>"8_bit"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/8_bit/32/bk.png" /></td>
                    <td><code>"alpha"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/alpha/32/bk.png" /></td>
                    <td><code>"bases"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/bases/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"book"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/book/32/bk.png" /></td>
                    <td><code>"bubblegum"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/bubblegum/32/bk.png" /></td>
                    <td><code>"blindfold"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/blindfold/32/bk.png" /> (probably not the most sensible choice!)</td>
                </tr>
                <tr>
                    <td><code>"cases"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/cases/32/bk.png" /></td>
                    <td><code>"classic"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/classic/32/bk.png" /></td>
                    <td><code>"club"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/club/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"condal"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/condal/32/bk.png" /></td>
                    <td><code>"dash"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/dash/32/bk.png" /></td>
                    <td><code>"game_room"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/game_room/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"glass"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/glass/32/bk.png" /></td>
                    <td><code>"gothic"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/gothic/32/bk.png" /></td>
                    <td><code>"graffiti"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/graffiti/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"icy_sea"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/icy_sea/32/bk.png" /></td>
                    <td><code>"light"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/light/32/bk.png" /></td>
                    <td><code>"lolz"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/lolz/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"marble"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/marble/32/bk.png" /></td>
                    <td><code>"maya"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/maya/32/bk.png" /></td>
                    <td><code>"metal"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/metal/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"modern"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/modern/32/bk.png" /></td>
                    <td><code>"nature"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/nature/32/bk.png" /></td>
                    <td><code>"neon"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/neon/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"neo"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/neo/32/bk.png" /></td>
                    <td><code>"neo_wood"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/neo_wood/32/bk.png" /></td>
                    <td><code>"newspaper"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/newspaper/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"ocean"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/ocean/32/bk.png" /></td>
                    <td><code>"sky"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/sky/32/bk.png" /></td>
                    <td><code>"space"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/space/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"tigers"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/32/bk.png" /></td>
                    <td><code>"tournament"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/tournament/32/bk.png" /></td>
                    <td><code>"vintage"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/vintage/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"wood"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/wood/32/bk.png" /></td>
                    <td><code>"3d_wood"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/3d_wood/32/bk.png" /></td>
                    <td><code>"3d_staunton"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/3d_staunton/32/bk.png" /></td>
                </tr>
                <tr>
                    <td><code>"3d_plastic"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/wood/32/bk.png" /></td>
                    <td><code>"3d_chesskid"</code> <img style="vertical-align:middle" src="https://images.chesscomfiles.com/chess-themes/pieces/3d_chesskid/32/bk.png" /></td>
                    <td></td>
                </tr>
            </table>
        </td>
    </tr>
</table>
