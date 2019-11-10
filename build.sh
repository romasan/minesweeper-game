#!/bin/sh

set -e

SRC="src/Index.elm"
JS="dist/bundle.js"
MIN="dist/bundle.js"
DONE="\033[0;32m\xE2\x9C\x94\033[0m"

overwrite() {
    echo -e "\r\033[1A";
    echo -e "\033[0K$@";
}

msg=""
msgStart() {
    msg=$@
    echo -n "  ${msg}: ..."    
}
msgEnd() {
    overwrite "${DONE} ${msg}: done"    
}

trap 'tput cnorm' EXIT
tput civis

msgStart building
elm make $SRC --optimize --output=$JS $@ 1> /dev/null
msgEnd

msgStart minify
uglifyjs $JS --compress 'pure_funcs="F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9",pure_getters,keep_fargs=false,unsafe_comps,unsafe' | uglifyjs --mangle --output=$MIN
msgEnd

tput cnorm

# ------------------------------------------------------------------------------

# B=$(tput bold)
# _B=$(tput sgr0)
# U=$(tput smul)
# _U=$(tput rmul)
# I=$(tput sitm) 
# _I=$(tput sgr0)

# echo "test ${I}italic${_I} ${B}bold${_B} ${U}underline${_U}"

# ------------------------------------------------------------------------------

# HEIGHT=$(tput lines)
# WIDTH=$(tput cols)
# PV=3
# PG=6
# C="/";

# trap 'tput cnorm;C=" ";drawScreen;tput cup 0 0;echo "exit."' EXIT
# clear -x
# tput civis

# stty -echo

# drawScreen() {
#     # echo -e "\033[0K"
#     tput cup 0 0
#     if [[ $C == "" ]]; then
#         C=" "
#     fi
#     L=""
#     for (( y=1; y <= $HEIGHT; y++ ))
#     do
#         for (( x=1; x <= $WIDTH; x++ ))
#         do
#             if [[ $x -le $PG ]] || [[ $x -gt $((WIDTH - PG)) ]] ||  [[ $y -le $PV ]] || [[ $y -gt $((HEIGHT - PV)) ]]; then
#                 L+=$C
#             else
#                 L+=" "
#             fi
#         done
#         # if [[ $y -lt $HEIGHT ]]; then
#         #     L+="\n"
#         # fi
#     done
#     printf '%s' "$L"
# }
# drawScreen

# while read -s -n1 C; do
#     drawScreen
# done