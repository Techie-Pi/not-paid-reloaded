use std::collections::HashMap;
use std::{fs};
use rocket::{Build, Config, launch, Rocket, get, routes, State};
use rocket::serde::{Serialize, Deserialize, json::Json};
use crate::guards::Hostname;

mod fairings;
mod guards;

#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Error {
    status: u16,
    error: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
struct DueConfig {
    server: ServerConfig,
    due_dates: HashMap<String, DueDate>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
struct ServerConfig {
    port: u16,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
struct DueDate {
    paid: bool,
    due: String,
    days: u32,
}

#[get("/website/<hostname>")]
fn get_website_status(hostname: Result<Hostname, Error>, config: &State<DueConfig>) -> Result<Json<&DueDate>, Json<Error>> {
    let hostname = match hostname {
        Ok(h) => h.hostname,
        Err(e) => return Err(Json(e)),
    };

    return match config.due_dates.get(hostname.as_str()) {
        None => Err(Json(Error {
            status: 400,
            error: Some(String::from("Hostname not found")),
        })),
        Some(d) => Ok(Json(d))
    };
}

#[get("/failure/<hostname>")]
fn report_failure(hostname: Result<Hostname, Error>) -> Result<String, Json<Error>> {
    let hostname = match hostname {
        Ok(h) => h.hostname,
        Err(e) => return Err(Json(e)),
    };

    println!("[/failure/<hostname>] Failure at {} reported", hostname);
    Ok(String::from("{ \"status\": 200, \"message\": \"Logged\" }"))
}

#[launch]
fn start() -> Rocket<Build> {
    let raw_config = fs::read_to_string("config.toml").expect("Couldn't read Due Dates");
    let config: DueConfig = toml::from_str(raw_config.as_str()).expect("Couldn't parse Due Dates");

    let cfg = Config {
        port: config.server.port,
        ..Config::default()
    };

    rocket::custom(&cfg)
        .manage(config)
        .attach(crate::fairings::CorsFairing)
        .mount("/api/v1", routes![get_website_status, report_failure])
}
