from django.db import migrations
from api.user.models import CustomUser

class Migration(migrations.Migration):
    def seed_data(apps, schema_editor):
        user = CustomUser(name="kbn", email="kbncodes@gmail.com", is_staff = True, is_superuser =True, phone ="9865986598", gender = "Male")

        user.set_password("kbn123456")
        user.save()

    dependencies =[

    ]

    operations = [
        migrations.RunPython(seed_data),
    ]