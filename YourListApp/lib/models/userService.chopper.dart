// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'userService.dart';

// **************************************************************************
// ChopperGenerator
// **************************************************************************

// ignore_for_file: always_put_control_body_on_new_line, always_specify_types, prefer_const_declarations
class _$UserService extends UserService {
  _$UserService([ChopperClient client]) {
    if (client == null) return;
    this.client = client;
  }

  @override
  final definitionType = UserService;

  @override
  Future<Response<dynamic>> getUsers() {
    final $url = '/users';
    final $request = Request('GET', $url, client.baseUrl);
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> getUser(Map<dynamic, dynamic> body) {
    final $url = '/users';
    final $body = body;
    final $request = Request('GET', $url, client.baseUrl, body: $body);
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> postUser(Map<dynamic, dynamic> body) {
    final $url = '/users';
    final $body = body;
    final $request = Request('POST', $url, client.baseUrl, body: $body);
    return client.send<dynamic, dynamic>($request);
  }
}
