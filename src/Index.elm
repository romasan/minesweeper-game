module Index exposing (..)

-- Press buttons to increment and decrement a counter.
--
-- Read how it works:
--   https://guide.elm-lang.org/architecture/buttons.html
--

import Browser
import Html exposing (Html, button, div, span, text)
import Html.Events exposing (onClick)
import String exposing (concat)

-- MAIN

main = Browser.sandbox {
  init = init,
  update = update,
  view = view }

-- MODEL

type alias MyModel = {
  x: Int }

init : MyModel
init = {
  x = 0 }

-- UPDATE

type Msg
  = Increment
  | Decrement

update : Msg -> MyModel -> MyModel
update msg model =
  case msg of
    Increment ->
      { model | x = model.x + 1 }

    Decrement ->
      { model | x = model.x - 1 }

-- VIEW

view : MyModel -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , span  [] [ text (concat [" ", String.fromInt model.x, " "]) ]
    , button [ onClick Increment ] [ text "+" ]
    ]