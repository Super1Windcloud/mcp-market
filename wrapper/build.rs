fn main() -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(target_os = "windows")]
    {
        use std::path::Path;

        let icon_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("../public/icon.ico");

        let icon_str = icon_path.to_str().unwrap();

        let mut res = winres::WindowsResource::new();
        res.set_icon(icon_str);
        res.compile()?;
    }

    Ok(())
}
