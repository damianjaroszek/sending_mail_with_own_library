(function() {

    var form = document.querySelector("#form"),
        message = document.querySelector("#message");

    function showMessage(type, msg) {

        message.className = type;
        message.innerHTML = msg;

    }

    function sendEmail(e) {

        e.preventDefault();

        var fields = form.querySelectorAll("input, textarea"),
            data = {};

            [].forEach.call(fields, function(field){ 
                //console.log(field); // wyświetlenie wszystkich pół input i textarea
                /*
                <input type="text" name="your-name" placeholder="Twoje imię">
                <input type="text" name="your-email" placeholder="Twój e-mail">
                <textarea name="your-message" placeholder="Twoja wiadomość"></textarea>
                */
                data[field.name] = field.value;
            });

            //console.log(data); //{your-name: '', your-email: '', your-message: ''} tworzenie pól obiektu poprzez pobranie nazw ze znaczników html z atrybutu name
                               // jak w polu formularza "Twoje imie" wpiszesz je wtedy {your-name: 'Damian', your-email: '', your-message: ''}

            AJAX({
                type: form.getAttribute("method"), //szczytanie "POST"   
                url: form.getAttribute("action"),
                data: data,
                success: function(response, xhr){
                    //console.log(response);

                    var res = JSON.parse(response); //JSON to string wyświetlały się komunikaty jako tablica

                    console.log(res);

                    if(Array.isArray(res)){
                        showMessage("error", res.join("<br>")); //jeżeli res jest tablicą, co za tym idzie zawiera błędy przypisz  className = "error", i wyświetli tekst poprzez innerHTML 
                        //na stronie ale rozdzielony br
                    }

                    else if("error" in res){
                        showMessage("error", res.error); //jeżeli w response mamy errror wywołaj showMessage, która przypisze className = "error", i wyświetli tekst poprzez innerHTML 
                                                         //na stronie
                    }

                    else if("success" in res){          // jeżeli mamy success wywołaj showMessage, która przypisze className = "success", i wyświetli tekst poprzez innerHTML 
                        //na stronie
                        showMessage("success", res.error);
                        form.removeEventListener("submit", sendEmail, false); //jeżeli success usuń zdarzenie submit aby uniemożliwić wysyłkę - samo to nie wystarczy, 
                        // bo usuniemy także prevent default a mail zostanie wysłany przez PHP bez Ajaxa stąd konieczne także dezaktywowanie przycisku
                        form.querySelector("button").setAttribute("disabled", "disabled"); //dezaktywacja przycisku

                    }

                    //console.log(res);
                }
            });                   

    }

    form.addEventListener("submit", sendEmail, false);

})();