from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User, Account, Fullname, Address


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        account = Account(**validated_data)
        account.set_password(validated_data['password'])
        account.save()
        return account

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            validated_data.pop('password')
        return super().update(instance, validated_data)


class FullnameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fullname
        fields = ['first_name', 'last_name']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['noHouse', 'street', 'district', 'city', 'country']


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer(required=False)
    fullname = FullnameSerializer(required=False)
    address = AddressSerializer(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'is_active': {'read_only': True}}

    def create(self, validated_data):
        print(validated_data)
        account_data = validated_data.pop('account')
        fullname_data = validated_data.pop('fullname', None)
        address_data = validated_data.pop('address', None)

        account = AccountSerializer.create(AccountSerializer(), validated_data=account_data)
        fullname = Fullname.objects.create(**fullname_data) if fullname_data else None
        address = Address.objects.create(**address_data) if address_data else None

        user = User.objects.create(account=account, fullname=fullname, address=address, **validated_data)
        return user

    def update(self, instance, validated_data):
        account_data = validated_data.pop('account', None)
        fullname_data = validated_data.pop('fullname', None)
        address_data = validated_data.pop('address', None)
        password = validated_data.pop('password', None)
        if password is not None:
            instance.set_password(password)
        if account_data:
            account = instance.account
            if 'password' in account_data:
                account_data['password'] = make_password(account_data['password'])
            AccountSerializer.update(AccountSerializer(), instance=account, validated_data=account_data)

        if fullname_data:
            if instance.fullname:
                FullnameSerializer.update(FullnameSerializer(), instance=instance.fullname,
                                          validated_data=fullname_data)
            else:
                instance.fullname = Fullname.objects.create(**fullname_data)

        if address_data:
            if instance.address:
                AddressSerializer.update(AddressSerializer(), instance=instance.address, validated_data=address_data)
            else:
                instance.address = Address.objects.create(**address_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    def update_avatar_banner(self, instance, validated_data):
        avatar = validated_data.get('avatar')
        banner = validated_data.get('banner')
        
        if avatar:
            instance.avatar.delete(save=False) 
            instance.avatar = avatar
        
        if banner:
            instance.banner.delete(save=False)
            instance.banner = banner

        instance.save()
        return instance
