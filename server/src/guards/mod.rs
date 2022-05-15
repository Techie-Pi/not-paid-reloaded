use std::str::from_utf8;
use rocket::request::{FromParam};
use crate::Error;

pub struct Hostname {
    pub hostname: String,
}

fn decode_hostname_base_64(hostname_base_64: &str) -> Result<Hostname, Error> {
    let hostname_err = Err(Error { status: 400, error: Some(String::from("Invalid Hostname")) });

    let hostname_vec = match base64::decode(hostname_base_64) {
        Ok(h) => h,
        Err(_) => return hostname_err,
    };

    let hostname = match from_utf8(hostname_vec.as_slice()) {
        Ok(h) => Hostname { hostname: String::from(h) },
        Err(_) => return hostname_err,
    };

    Ok(hostname)
}

impl<'r> FromParam<'r> for Hostname {
    type Error = Error;

    fn from_param(param: &'r str) -> Result<Self, Self::Error> {
        decode_hostname_base_64(param)
    }
}
