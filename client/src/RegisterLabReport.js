
import './App.css';
import {useState, useRef} from 'react';
import Axios from 'axios'
import React from 'react';
import {TextField} from '@material-ui/core';
import {Button} from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
const RegisterPractica = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCat] = useState('');

    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const reCaptcha = useRef();
    const registrarPractica = () => {

        if (!token) {
            setError("Verify captcha")
            return;
        }
        else {
            setError("")

            Axios.post('http://localhost:3002/reCaptcha', {
                token: token
            }).then(() => {
                reCaptcha.current.reset();
                setToken("");
                alert("Practica registrada");

                Axios.post('http://localhost:3002/createLabReport', {
                    nombre: nombre,
                    descripcion: descripcion,
                    categoria: categoria
                }).then(() => {
                    console.log("Frontend and backend connected.")
                    document.getElementById("integrante-form").reset();
                    alert("Practica registrada correctamente.")
                })

            })
                .catch(e => {
                    setError(e)
                })
                .finally(() => {
                    setToken("");
                })

        }

    };

    return (
        <div>
            <form id="integrante-form" className="mainDisplay">
                <h2>Registrar practica</h2>
                <label>Nombre de la practica:</label>
                <TextField
                    type="text"
                    onChange={(event) => {
                        setNombre(event.target.value)

                    }}
                />
                <label>Categoria</label>
                <TextField
                    type="text"
                    onChange={(event) => {
                        setCat(event.target.value)

                    }}
                />
                <label>Descripcion de la practica</label>
                <TextField
                    type="text"
                    multiline
                    fullWidth
                    rowsMax={4}
                    onChange={(event) => {
                        setDescripcion(event.target.value)
                    }
                    }
                ></TextField>
                <ReCAPTCHA className="recaptcha-Spacing"
                    sitekey="6LdSbs0aAAAAAIQgPXIQXHfEPB9WyTKyv2iyYljm"
                    onChange={token => {
                        setToken(token)
                    }}
                    onExpired={e => setToken("")}
                    ref={reCaptcha}
                ></ReCAPTCHA>
                <Button variant="outlined" onClick={registrarPractica}>Registrar practica</Button>
            </form>
        </div>

    )
}
export default RegisterPractica;
